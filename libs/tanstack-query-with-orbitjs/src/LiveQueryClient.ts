import {MemorySource} from "@orbit/memory";
import {QueryClient, QueryClientConfig, QueryKey} from "@tanstack/query-core";

import {LiveQueryAdapterCache} from "./LiveQueryAdapterCache";

declare module "@tanstack/query-core" {
    export interface QueryMeta {
        getQueryOrExpressions?: <TQueryKey extends QueryKey = QueryKey>(
            queryKey: TQueryKey,
            pageParam?: number,
        ) => Parameters<MemorySource["query"]>[0];
        isInfinite?: boolean;
        pageSize?: number;
    }
}

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
                return memorySource.activated.then(
                    async () =>
                        await memorySource.query(
                            getQueryOrExpressions(
                                ctx.queryKey,
                                ctx.pageParam ?? 0,
                            ),
                        ),
                );
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
