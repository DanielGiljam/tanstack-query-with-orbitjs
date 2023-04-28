import {RecordQueryExpressionResult} from "@orbit/records";
import {LiveQueryObserver} from "@tanstack-query-with-orbitjs/core";
import type {
    QueryFunction,
    QueryKey,
    QueryObserver,
} from "@tanstack/query-core";
import {parseQueryArgs} from "@tanstack/query-core";
import type {
    DefinedUseQueryResult,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query";
import {useBaseQuery} from "@tanstack/react-query";

import {useLiveQueryClient} from "./useLiveQueryClient";

// HOOK
// useQuery source from @tanstack/react-query@4.16.0 with minor tweaks

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "initialData"
    > & {initialData?: () => undefined},
): UseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "initialData"
    > & {initialData: TQueryFnData | (() => TQueryFnData)},
): DefinedUseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "initialData"
    > & {initialData?: () => undefined},
): UseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "initialData"
    > & {initialData: TQueryFnData | (() => TQueryFnData)},
): DefinedUseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey"
    >,
): UseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn" | "initialData"
    > & {initialData?: () => undefined},
): UseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn" | "initialData"
    > & {initialData: TQueryFnData | (() => TQueryFnData)},
): DefinedUseQueryResult<TData, TError>;

export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null> = Exclude<
        RecordQueryExpressionResult,
        null
    >,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn"
    >,
): UseQueryResult<TData, TError>;

// eslint-disable-next-line func-style
export function useLiveQuery<
    TQueryFnData extends Exclude<RecordQueryExpressionResult, null>,
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    arg1: TQueryKey | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    arg2?:
        | QueryFunction<TQueryFnData, TQueryKey>
        | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    useLiveQueryClient({context: parsedOptions.context});
    return useBaseQuery(
        parsedOptions,
        LiveQueryObserver as typeof QueryObserver,
    );
}
