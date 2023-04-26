import {QueryCache} from "@tanstack/query-core";

import {LiveQueryAdapter} from "./LiveQueryAdapter";
import { LiveQueryClient } from "./LiveQueryClient";

type QueryCacheNotifyEvent = Parameters<
    Parameters<QueryCache["subscribe"]>[0]
>[0];

export interface LiveQueryAdapterCacheConfig {
    client: LiveQueryClient;
}

export class LiveQueryAdapterCache {
    private readonly adapterMap: Record<string, LiveQueryAdapter | undefined> =
        {};

    private readonly client: LiveQueryClient;

    constructor(config: LiveQueryAdapterCacheConfig) {
        const client = (this.client = config.client)
        client.getQueryCache().subscribe((event) => this.onQueryCacheNotifyEvent(event));
    }

    private onQueryCacheNotifyEvent({type, query}: QueryCacheNotifyEvent) {
        let adapter = this.adapterMap[query.queryHash];
        const queryIsDisabled = query.isDisabled();
        this.client.getLogger().log(
            "LiveQueryAdapterCache: before onQueryCacheNotifyEvent:",
            {adapter, eventType: type, queryIsDisabled, queryKey: query.queryKey},
        );
        if (adapter != null) {
            if (type === "removed" || queryIsDisabled) {
                adapter.disconnect();
                adapter = this.adapterMap[query.queryHash] = undefined;
            }
        } else {
            if (type !== "removed" && !queryIsDisabled) {
                adapter = this.adapterMap[query.queryHash] =
                    new LiveQueryAdapter({
                        client: this.client,
                        query,
                    });
            }
        }
        this.client.getLogger().log(
            "LiveQueryAdapterCache: after onQueryCacheNotifyEvent:",
            {
                adapter,
                eventType: type,
                queryIsDisabled,
                queryKey: query.queryKey
            },
        );
    }
}
