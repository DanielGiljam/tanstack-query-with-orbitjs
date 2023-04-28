import {InitializedRecord} from "@orbit/records";
import {LiveInfiniteQueryObserver} from "@tanstack-query-with-orbitjs/core";
import type {
    QueryFunction,
    QueryKey,
    QueryObserver,
} from "@tanstack/query-core";
import {parseQueryArgs} from "@tanstack/query-core";
import type {
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {useBaseQuery} from "@tanstack/react-query";

import {useLiveQueryClient} from "./useLiveQueryClient";

// HOOK
// useInfiniteQuery source from @tanstack/react-query@4.16.0 with minor tweaks

export function useLiveInfiniteQuery<
    TQueryFnData extends InitializedRecord[] = InitializedRecord[],
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
): UseInfiniteQueryResult<TData, TError>;
export function useLiveInfiniteQuery<
    TQueryFnData extends InitializedRecord[] = InitializedRecord[],
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    options?: Omit<
        UseInfiniteQueryOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryFnData,
            TQueryKey
        >,
        "queryKey"
    >,
): UseInfiniteQueryResult<TData, TError>;
export function useLiveInfiniteQuery<
    TQueryFnData extends InitializedRecord[] = InitializedRecord[],
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: Omit<
        UseInfiniteQueryOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryFnData,
            TQueryKey
        >,
        "queryKey" | "queryFn"
    >,
): UseInfiniteQueryResult<TData, TError>;
// eslint-disable-next-line func-style
export function useLiveInfiniteQuery<
    TQueryFnData extends InitializedRecord[],
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    arg1:
        | TQueryKey
        | UseInfiniteQueryOptions<
              TQueryFnData,
              TError,
              TData,
              TQueryFnData,
              TQueryKey
          >,
    arg2?:
        | QueryFunction<TQueryFnData, TQueryKey>
        | UseInfiniteQueryOptions<
              TQueryFnData,
              TError,
              TData,
              TQueryFnData,
              TQueryKey
          >,
    arg3?: UseInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
    >,
): UseInfiniteQueryResult<TData, TError> {
    const options = parseQueryArgs(arg1, arg2, arg3);
    useLiveQueryClient({context: options.context});
    return useBaseQuery(
        options,
        LiveInfiniteQueryObserver as typeof QueryObserver,
    ) as UseInfiniteQueryResult<TData, TError>;
}
