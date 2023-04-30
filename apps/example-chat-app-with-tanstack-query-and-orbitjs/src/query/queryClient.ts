import {LiveQueryClient} from "@tanstack-query-with-orbitjs/react";

import {getCoordinator} from "../orbit";

export const queryClient = new LiveQueryClient({
    memorySource: getCoordinator().getSource("memory"),
});
