import {
    Coordinator,
    EventLoggingStrategy,
    LogTruncationStrategy,
    RequestStrategy,
} from "@orbit/coordinator";
import {IndexedDBSource} from "@orbit/indexeddb";
import {IndexedDBBucket} from "@orbit/indexeddb-bucket";
import {MemorySource} from "@orbit/memory";
import {RecordSchema} from "@orbit/records";

import * as dataModels from "../data-models";

import {addMemoryLyraDBUpdateStrategy} from "./memoryLyraDBUpdateStrategy";
import {maybeLoadTestData} from "./testData";
import {normalizeRecordQueryResult} from "./utils";

let coordinator: Coordinator | undefined;
let coordinatorHasActivated = false;

export const getCoordinator = async () => {
    if (coordinator != null) {
        await coordinator.activated;
        return coordinator;
    }

    const schema = new RecordSchema({
        models: Object.fromEntries(
            Object.entries(dataModels).map(([key, value]) => [
                key,
                value.orbitSchema,
            ]),
        ),
    });

    const bucket = new IndexedDBBucket();

    const memory = new MemorySource({schema, bucket});

    const indexedDB = new IndexedDBSource({
        schema,
        bucket,
        defaultTransformOptions: {useBuffer: true},
    });

    coordinator = new Coordinator({
        sources: [memory, indexedDB],
    });

    const memoryIndexeddbQueryStrategy = new RequestStrategy({
        source: "memory",
        on: "beforeQuery",
        target: "indexedDB",
        action: "query",
        blocking: true,
    });

    indexedDB.on(
        "query",
        async (
            _query: never,
            response: NonNullable<
                Awaited<ReturnType<IndexedDBSource["query"]>>
            >,
        ) =>
            await memory.sync((t) =>
                normalizeRecordQueryResult(response.data).map((record) =>
                    t.updateRecord(record),
                ),
            ),
    );

    coordinator.addStrategy(memoryIndexeddbQueryStrategy);

    const memoryIndexeddbUpdateStrategy = new RequestStrategy({
        source: "memory",
        on: "update",
        target: "indexedDB",
        action: "update",
    });

    coordinator.addStrategy(memoryIndexeddbUpdateStrategy);

    addMemoryLyraDBUpdateStrategy(memory);

    const logTruncationStrategy = new LogTruncationStrategy();

    coordinator.addStrategy(logTruncationStrategy);

    const eventLoggingStrategy = new EventLoggingStrategy();

    coordinator.addStrategy(eventLoggingStrategy);

    try {
        console.log("Coordinator: activating...");
        await coordinator.activate();
        coordinatorHasActivated = true;
        console.log("Coordinator: activation success.");
    } catch (error) {
        console.error("Coordinator: activation error.");
        throw error;
    }

    void maybeLoadTestData(coordinator);

    // @ts-expect-error for testing purposes
    window.coordinator = coordinator;

    return coordinator;
};

export const getCoordinatorSync = () => {
    if (coordinatorHasActivated) {
        return coordinator;
    }
};
