import {RecordQueryResult} from "@orbit/records";
import {
    QueryKey,
    QueryObserver,
    QueryObserverOptions,
} from "@tanstack/query-core";

import {LiveQueryClient} from "./LiveQueryClient";

export class LiveQueryObserver<
    TQueryFnData extends RecordQueryResult = RecordQueryResult,
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
                if (enabled !== false) {
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
                return memorySource.cache.query(
                    getQueryOrExpressions(queryKey),
                ) as TQueryData | undefined;
            },
            ...options,
        });
    }
}
