import {MemorySource} from "@orbit/memory";
import {RecordQueryBuilder} from "@orbit/records";
import {QueryClient, QueryClientConfig, QueryKey} from "@tanstack/query-core";

import {LiveQueryAdapterCache} from "./LiveQueryAdapterCache";
import {normalizeRecordQueryResult} from "./utils";

export type GetQueryOrExpressions<TQueryKey extends QueryKey = QueryKey> = (
    queryBuilder: RecordQueryBuilder,
    queryKey: TQueryKey,
    pageParam?: number,
) => Parameters<MemorySource["query"]>[0];

declare module "@tanstack/query-core" {
    export interface QueryMeta {
        getQueryOrExpressions?: GetQueryOrExpressions;
        isInfinite?: boolean;
        pageSize?: number;
    }
}

export type {QueryMeta} from "@tanstack/query-core";

const mergeLiveQueryClientConfig = (
    config: LiveQueryClientConfig,
): QueryClientConfig => ({
    ...config,
    defaultOptions: {
        ...config.defaultOptions,
        queries: {
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            queryFn: (ctx) => {
                const getQueryOrExpressions = ctx.meta?.getQueryOrExpressions;
                if (getQueryOrExpressions == null) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject("Missing meta.getQueryOrExpressions");
                }
                const memorySource = config.memorySource;
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
                });
            },
            staleTime: Infinity,
            cacheTime: 0,
            ...config.defaultOptions?.queries,
        },
    },
});

export interface LiveQueryClientConfig extends QueryClientConfig {
    memorySource: MemorySource;
}

export class LiveQueryClient extends QueryClient {
    private readonly memorySource: MemorySource;
    private readonly liveQueryAdapterCache: LiveQueryAdapterCache;

    private memorySourceIsActivated = false;

    constructor(config: LiveQueryClientConfig) {
        super(mergeLiveQueryClientConfig(config));
        const memorySource = (this.memorySource = config.memorySource);
        this.liveQueryAdapterCache = new LiveQueryAdapterCache({
            client: this,
        });
        void memorySource.activated.then(() => {
            this.memorySourceIsActivated = true;
        });
    }

    getMemorySource(): MemorySource {
        return this.memorySource;
    }

    getMemorySourceIfActivated(): MemorySource | undefined {
        if (this.memorySourceIsActivated) {
            return this.memorySource;
        }
        return undefined;
    }
}
