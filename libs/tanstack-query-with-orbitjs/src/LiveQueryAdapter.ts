import {MemorySource} from "@orbit/memory";
import {InitializedRecord} from "@orbit/records";
import {InfiniteData, Query} from "@tanstack/query-core";

import {LiveQueryClient} from "./LiveQueryClient";

type LiveQuery = ReturnType<MemorySource["cache"]["liveQuery"]>;
type LiveQueryUpdate = Parameters<Parameters<LiveQuery["subscribe"]>[0]>[0];

export interface LiveQueryAdapterConfig {
    client: LiveQueryClient;
    query: Query;
}

export class LiveQueryAdapter {
    private readonly client: LiveQueryClient;
    private readonly query: Query;

    private unsubscribeFromLiveQuery: (() => void) | undefined;

    private disconnected = false;

    constructor(config: LiveQueryAdapterConfig) {
        this.client = config.client;
        this.query = config.query;
        void this.connect();
    }

    private async connect() {
        await this.client.getMemorySource().activated;
        if (this.disconnected) {
            return;
        }
        const getQueryOrExpressions =
            this.query.options.meta?.getQueryOrExpressions;
        if (getQueryOrExpressions == null) {
            throw new Error("Missing meta.getQueryOrExpressions");
        }
        const liveQuery = this.client
            .getMemorySource()
            .cache.liveQuery(getQueryOrExpressions(this.query.queryKey));
        this.client.getLogger().log("LiveQueryAdapter: created liveQuery:", {
            adapter: this,
            liveQuery,
            queryKey: this.query.queryKey,
        });
        const unsubscribeFromLiveQuery = liveQuery.subscribe((update) => {
            void this.onLiveQueryUpdate(update);
        });
        this.client
            .getLogger()
            .log("LiveQueryAdapter: subscribed to liveQuery:", {
                adapter: this,
                liveQuery,
                queryKey: this.query.queryKey,
            });
        this.unsubscribeFromLiveQuery = () => {
            unsubscribeFromLiveQuery();
            this.client
                .getLogger()
                .log("LiveQueryAdapter: unsubscribed from liveQuery:", {
                    adapter: this,
                    liveQuery,
                    queryKey: this.query.queryKey,
                });
        };
    }

    disconnect() {
        this.unsubscribeFromLiveQuery?.();
        this.disconnected = true;
    }

    private async onLiveQueryUpdate(update: LiveQueryUpdate) {
        if (this.query.options.meta?.isInfinite === true) {
            const pageSize = this.query.options.meta.pageSize;
            if (pageSize == null) {
                throw new Error("Missing meta.pageSize");
            }
            const wasFetching = this.client.isFetching(this.query.queryKey) > 0;
            const wasFetchingNextPage =
                wasFetching &&
                this.query.state.fetchMeta?.fetchMore?.direction === "forward";
            const wasFetchingPreviousPage =
                wasFetching &&
                this.query.state.fetchMeta?.fetchMore?.direction === "backward";
            if (wasFetching) {
                await this.client.cancelQueries(this.query.queryKey);
            }
            if (this.disconnected) {
                return;
            }
            this.client.setQueryData<InfiniteData<InitializedRecord[]>>(
                this.query.queryKey,
                (data) => {
                    const records = update.query<InitializedRecord[]>();
                    const pages: InitializedRecord[][] = [];
                    const pageParams: number[] = [];
                    let offset = 0;
                    let page = -1;
                    while (
                        (data?.pages.length ?? 1) > pages.length &&
                        offset < records.length
                    ) {
                        pages.push(records.slice(offset, (offset += pageSize)));
                        pageParams.push(++page);
                    }
                    return {
                        pages,
                        pageParams,
                    };
                },
            );
            if (
                wasFetching &&
                !(wasFetchingNextPage || wasFetchingPreviousPage)
            ) {
                void this.client.refetchQueries(this.query.queryKey);
            }
        } else {
            const wasFetching = this.client.isFetching(this.query.queryKey) > 0;
            if (wasFetching) {
                await this.client.cancelQueries(this.query.queryKey);
            }
            if (this.disconnected) {
                return;
            }
            this.client.setQueryData(this.query.queryKey, update.query());
            if (wasFetching) {
                void this.client.refetchQueries(this.query.queryKey);
            }
        }
    }
}
