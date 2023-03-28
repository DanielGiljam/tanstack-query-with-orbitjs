import MemorySource from "@orbit/memory";
import {QueryKey, UseQueryOptions, useQuery} from "@tanstack/react-query";

import {getCoordinatorSync} from "../orbit";
import {normalizeRecordQueryResult} from "../orbit/utils";

export const useQueryWithInitialData = <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) =>
    useQuery<TQueryFnData, TError, TData, TQueryKey>({
        initialData: () => {
            const coordinator = getCoordinatorSync();
            if (coordinator != null) {
                const result = coordinator
                    .getSource<MemorySource>("memory")
                    .cache.query(
                        options.meta!.getQueryOrExpressions(options.queryKey!),
                    );
                const normalizedResult = normalizeRecordQueryResult(result);
                if (normalizedResult.length > 0) {
                    return result as never;
                }
            }
        },
        ...options,
        meta: {
            liveQuery: true,
            ...options.meta!,
        },
    });
