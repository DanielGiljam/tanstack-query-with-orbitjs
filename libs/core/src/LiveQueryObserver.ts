import {RecordQueryExpressionResult} from "@orbit/records";
import {
    QueryKey,
    QueryObserver,
    QueryObserverOptions,
} from "@tanstack/query-core";

import {LiveQueryClient} from "./LiveQueryClient";
import {normalizeRecordQueryResult} from "./utils";

export class LiveQueryObserver<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> extends QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    constructor(
        client: LiveQueryClient,
        options: QueryObserverOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey
        >,
    ) {
        super(client, {
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            queryFn: (ctx) => {
                const getQueryOrExpressions = ctx.meta?.getQueryOrExpressions;
                if (getQueryOrExpressions == null) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject("Missing meta.getQueryOrExpressions");
                }
                const memorySource = client.getMemorySource();
                return memorySource.activated.then(async () => {
                    const result = await memorySource.query(
                        getQueryOrExpressions(
                            memorySource.queryBuilder,
                            ctx.queryKey,
                            ctx.pageParam ?? 0,
                        ),
                    );
                    const normalizedResult = normalizeRecordQueryResult(result);
                    if (normalizedResult.length > 0) {
                        return result;
                    }
                    if (Array.isArray(result)) {
                        return [];
                    }
                    return undefined;
                }) as Promise<TQueryFnData>;
            },
            initialData: () => {
                const enabled = options.enabled;
                if (enabled === false) {
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
                const memorySource = client.getMemorySourceIfActivated();
                if (memorySource == null) {
                    return;
                }
                const result = memorySource.cache.query(
                    getQueryOrExpressions(memorySource.queryBuilder, queryKey),
                );
                const normalizedResult = normalizeRecordQueryResult(result);
                if (normalizedResult.length > 0) {
                    return result as TQueryData;
                }
                if (Array.isArray(result)) {
                    return [] as TQueryData;
                }
                return undefined;
            },
            staleTime: Infinity,
            cacheTime: 0,
            ...options,
        });
    }
}
