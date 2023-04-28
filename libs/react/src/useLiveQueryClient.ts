import {LiveQueryClient} from "@tanstack-query-with-orbitjs/core";
import {ContextOptions, useQueryClient} from "@tanstack/react-query";

export const useLiveQueryClient = (contextOptions: ContextOptions = {}) => {
    const queryClient = useQueryClient(contextOptions);
    if (queryClient instanceof LiveQueryClient) {
        return queryClient;
    } else {
        throw new Error(
            "Normal QueryClient found in context, when expected LiveQueryClient",
        );
    }
};
