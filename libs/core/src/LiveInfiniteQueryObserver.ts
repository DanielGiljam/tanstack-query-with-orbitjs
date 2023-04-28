import {InitializedRecord} from "@orbit/records";
import {
    InfiniteQueryObserver,
    InfiniteQueryObserverOptions,
    QueryKey,
} from "@tanstack/query-core";

import {LiveQueryClient} from "./LiveQueryClient";

export class LiveInfiniteQueryObserver<
    TQueryFnData extends InitializedRecord[] = InitializedRecord[],
    TError = unknown,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> extends InfiniteQueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
> {
    constructor(
        client: LiveQueryClient,
        options: InfiniteQueryObserverOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey
        >,
    ) {
        super(client, {
            initialData: () => {
                const enabled = options.enabled;
                if (enabled !== true) {
                    return;
                }
                const queryKey = options.queryKey;
                if (queryKey == null) {
                    return;
                }
                const getQueryOrExpressions =
                    options.meta?.getQueryOrExpressions;
                if (getQueryOrExpressions == null) {
                    return;
                }
                const pageSize = options.meta?.pageSize;
                if (pageSize == null) {
                    return;
                }
                const memorySource = client.getMemorySourceIfActivated();
                if (memorySource == null) {
                    return;
                }
                const records = memorySource.cache.query<TQueryFnData>(
                    getQueryOrExpressions(queryKey, 0),
                );
                if (records.length > 0) {
                    return {
                        pages: [records.slice(0, pageSize) as TQueryData],
                        pageParams: [0],
                    };
                }
                return undefined;
            },
            ...options,
            meta: {
                isInfinite: true,
                ...options.meta,
            },
        });
    }

    override setOptions(
        options?: Parameters<
            InfiniteQueryObserver<
                TQueryFnData,
                TError,
                TData,
                TQueryData,
                TQueryKey
            >["setOptions"]
        >[0],
        notifyOptions?: Parameters<
            InfiniteQueryObserver<
                TQueryFnData,
                TError,
                TData,
                TQueryData,
                TQueryKey
            >["setOptions"]
        >[1],
    ) {
        let optionsWithMetaIsInfinite;
        if (options?.meta != null && "isInfinite" in options.meta) {
            optionsWithMetaIsInfinite = options;
        } else {
            optionsWithMetaIsInfinite = {
                ...options,
                meta: {isInfinite: true, ...options?.meta},
            };
        }
        super.setOptions(optionsWithMetaIsInfinite, notifyOptions);
    }
}
