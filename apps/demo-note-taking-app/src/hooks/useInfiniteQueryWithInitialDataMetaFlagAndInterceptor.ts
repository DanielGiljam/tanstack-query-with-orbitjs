import MemorySource from "@orbit/memory";
import {InitializedRecord} from "@orbit/records";
import {
    QueryKey,
    UseInfiniteQueryOptions,
    useInfiniteQuery,
} from "@tanstack/react-query";

import {getCoordinator, getCoordinatorSync} from "../orbit";

export const useInfiniteQueryWithInitialDataMetaFlagAndInterceptor = <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: UseInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
    >,
) =>
    useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey>({
        initialData: () => {
            const coordinator = getCoordinatorSync();
            if (coordinator != null) {
                const records = coordinator
                    .getSource<MemorySource>("memory")
                    .cache.query<InitializedRecord[]>(
                        options.meta!.getQueryOrExpressions(options.queryKey!),
                    );
                if (records.length > 0) {
                    const pages: InitializedRecord[][] = [];
                    const pageSize = options.meta!.pageSize ?? 10;
                    pages.push(records.slice(0, pageSize));
                    return {
                        pages: pages as never,
                        pageParams: pages.map((_record, index) => index),
                    };
                }
            }
        },
        ...options,
        meta: {
            interceptInfiniteQueryBehavior: async (data) => {
                const coordinator = await getCoordinator();
                const records = coordinator
                    .getSource<MemorySource>("memory")
                    .cache.query<InitializedRecord[]>(
                        options.meta!.getQueryOrExpressions(options.queryKey!),
                    );
                const pages: InitializedRecord[][] = [];
                let offset = 0;
                const pageSize = options.meta!.pageSize ?? 10;
                while (
                    data.pages.length > pages.length &&
                    offset < records.length
                ) {
                    pages.push(records.slice(offset, (offset += pageSize)));
                }
                if (pages.length === 0) {
                    pages.push([]);
                }
                return {
                    pages,
                    pageParams: pages.map((_page, index) => index),
                };
            },
            isInfinite: true,
            liveQuery: true,
            pageSize: 10,
            ...options.meta!,
        },
    });
