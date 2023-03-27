import MemorySource from "@orbit/memory";
import {QueryKey, UseQueryOptions, useQuery} from "@tanstack/react-query";

import {getCoordinatorSync} from "../orbit";

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
                const resultAsFiltered1DArray = (
                    Array.isArray(result) ? result : [result]
                )
                    .flat()
                    .filter(
                        (result): result is NonNullable<typeof result> =>
                            result != null,
                    );
                if (resultAsFiltered1DArray.length > 0) {
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
