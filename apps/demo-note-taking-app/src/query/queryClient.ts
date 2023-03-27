import {MemorySource} from "@orbit/memory";
import {InitializedRecord} from "@orbit/records";
import {
    InfiniteData,
    Query,
    QueryCache,
    QueryClient,
    QueryKey,
} from "@tanstack/react-query";

import {getCoordinator} from "../orbit";

declare module "@tanstack/react-query" {
    export interface QueryMeta {
        getQueryOrExpressions: (
            queryKey: QueryKey,
            pageParam?: number,
        ) => Parameters<MemorySource["query"]>[0];
        interceptInfiniteQueryBehavior?: (
            data: InfiniteData<unknown>,
        ) => Promise<InfiniteData<unknown>>;
        isInfinite?: boolean;
        keepAlive?: boolean;
        liveQuery?: boolean;
        pageSize?: number;
    }
}

const eventTypeLogTermMap = {
    observerAdded: "observer added",
    updated: "query updated",
};

type LiveQuery = ReturnType<MemorySource["cache"]["liveQuery"]>;

interface LiveQueryCacheEntry {
    promiseOfLiveQuery: Promise<void>;
    liveQuery?: LiveQuery;
    unsubscribeFromLiveQuery?: () => void;
}

const getLiveQuery = async (query: Query) => {
    const coordinator = await getCoordinator();
    return coordinator
        .getSource<MemorySource>("memory")
        .cache.liveQuery(query.meta!.getQueryOrExpressions(query.queryKey));
};

let queryClient: QueryClient;

export const getQueryClient = () => {
    if (queryClient != null) {
        return queryClient;
    }
    const queryCache = new QueryCache();
    const liveQueryCache: Record<string, LiveQueryCacheEntry | undefined> = {};
    queryCache.subscribe((event) => {
        if (event.type === "observerAdded" || event.type === "updated") {
            const query = event.query;
            console.log(`Query cache: ${eventTypeLogTermMap[event.type]}.`, [
                ...query.queryKey,
            ]);
            if (event.query.meta?.liveQuery !== true) {
                return;
            }
            if (
                (event.query.options as {enabled?: boolean}).enabled === false
            ) {
                return;
            }
            if (liveQueryCache[query.queryHash] != null) {
                console.log(
                    "Query cache: already created live query. Skipping live query creation step.",
                    [...query.queryKey],
                    {...liveQueryCache[query.queryHash]},
                );
                return;
            }
            liveQueryCache[query.queryHash] = {
                promiseOfLiveQuery: getLiveQuery(query).then((liveQuery) => {
                    const entry = liveQueryCache[query.queryHash];
                    if (entry != null) {
                        entry.liveQuery = liveQuery;
                        console.log(
                            "Query cache: created live query.",
                            [...query.queryKey],
                            {...liveQueryCache[query.queryHash]},
                        );
                        let unsubscribeFromLiveQuery: () => void;
                        if (query.meta!.isInfinite === true) {
                            const pageSize = query.meta!.pageSize!;
                            unsubscribeFromLiveQuery = liveQuery.subscribe(
                                (update) =>
                                    queryClient.setQueryData<
                                        InfiniteData<InitializedRecord[]>
                                    >(query.queryKey, (data) => {
                                        const records =
                                            update.query<InitializedRecord[]>();
                                        const pages: InitializedRecord[][] = [];
                                        let offset = 0;
                                        while (
                                            (data?.pages.length ?? 1) >
                                                pages.length &&
                                            offset < records.length
                                        ) {
                                            pages.push(
                                                records.slice(
                                                    offset,
                                                    (offset += pageSize),
                                                ),
                                            );
                                        }
                                        return {
                                            pages,
                                            pageParams: pages.map(
                                                (_record, index) => index,
                                            ),
                                        };
                                    }),
                            );
                        } else {
                            unsubscribeFromLiveQuery = liveQuery.subscribe(
                                (update) =>
                                    queryClient.setQueryData(
                                        query.queryKey,
                                        update.query(),
                                    ),
                            );
                        }
                        entry.unsubscribeFromLiveQuery = () => {
                            console.log(
                                "Query cache: unsubscribed to live query.",
                                [...query.queryKey],
                                {...liveQueryCache[query.queryHash]},
                            );
                            unsubscribeFromLiveQuery();
                        };
                        console.log(
                            "Query cache: subscribed to live query.",
                            [...query.queryKey],
                            {...liveQueryCache[query.queryHash]},
                        );
                    } else {
                        console.log(
                            "Query cache: created live query but it seems that it is no longer needed. Voided live query.",
                            [...query.queryKey],
                        );
                    }
                }),
            };
            console.log(
                "Query cache: creating live query...",
                [...query.queryKey],
                {...liveQueryCache[query.queryHash]},
            );
            return;
        }
        if (event.type === "observerRemoved") {
            const query = event.query;
            console.log("Query cache: observer removed.", [...query.queryKey]);
            if (
                (event.query.options as {enabled?: boolean}).enabled === false
            ) {
                return;
            }
            if (query.meta?.keepAlive !== true) {
                liveQueryCache[query.queryHash]?.unsubscribeFromLiveQuery?.();
                const existed = liveQueryCache[query.queryHash] != null;
                liveQueryCache[query.queryHash] = undefined;
                if (existed) {
                    console.log("Query cache: removed live query.", [
                        ...query.queryKey,
                    ]);
                }
            }
        }
    });
    queryClient = new QueryClient({
        queryCache,
        defaultOptions: {
            queries: {
                queryFn: async (ctx) => {
                    const coordinator = await getCoordinator();
                    return await coordinator
                        .getSource<MemorySource>("memory")
                        .query(
                            ctx.meta!.getQueryOrExpressions(
                                ctx.queryKey,
                                ctx.meta!.isInfinite === true
                                    ? ctx.pageParam ?? 0
                                    : undefined,
                            ),
                        );
                },
                suspense: true,
                staleTime: Infinity,
                cacheTime: 0,
            },
        },
    });
    return queryClient;
};
