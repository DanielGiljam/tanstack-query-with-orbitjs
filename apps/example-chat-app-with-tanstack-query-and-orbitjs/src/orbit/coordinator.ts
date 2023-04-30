import {Coordinator, EventLoggingStrategy} from "@orbit/coordinator";
import MemorySource from "@orbit/memory";

import {schema} from "./schema";
import {addSimpleMemoryRemoteRequestStrategy} from "./simpleMemoryRemoteRequestStrategy";

let coordinator: Coordinator | undefined;

export const getCoordinator = () => {
    if (coordinator != null) {
        return coordinator;
    }

    const memorySource = new MemorySource({schema});

    addSimpleMemoryRemoteRequestStrategy(memorySource);

    coordinator = new Coordinator({
        sources: [memorySource],
    });

    const eventLoggingStrategy = new EventLoggingStrategy();

    coordinator.addStrategy(eventLoggingStrategy);

    console.log("Coordinator: activating...");
    coordinator
        .activate()
        .then(() => console.log("Coordinator: activation success."))
        .catch((error) => {
            console.error("Coordinator: activation failure.");
            console.error(error);
        });

    if (typeof window !== "undefined") {
        // @ts-expect-error for testing purposes
        window.coordinator = coordinator;
    }

    return coordinator;
};
