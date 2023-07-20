import {MemorySource} from "@orbit/memory";
import {RecordQueryBuilder} from "@orbit/records";
import {QueryClient, QueryClientConfig, QueryKey} from "@tanstack/query-core";

import {LiveQueryAdapterCache} from "./LiveQueryAdapterCache";

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

export interface LiveQueryClientConfig extends QueryClientConfig {
    memorySource: MemorySource;
}

export class LiveQueryClient extends QueryClient {
    private readonly memorySource: MemorySource;
    private readonly liveQueryAdapterCache: LiveQueryAdapterCache;

    private memorySourceIsActivated = false;

    constructor(config: LiveQueryClientConfig) {
        super(config);
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
