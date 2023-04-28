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
                const memorySource = client.getMemorySourceIfActivated();
                if (memorySource == null) {
                    return;
                }
                const result = memorySource.cache.query(
                    getQueryOrExpressions(queryKey),
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
            ...options,
        });
    }
}
