import {
    PropertiesSchema,
    ResolveSchema,
    getByID,
    insertBatch,
    remove,
} from "@lyrasearch/lyra";
import {MemorySource} from "@orbit/memory";
import {RecordOperation, RecordTransform} from "@orbit/records";
import {dequal} from "dequal";

import * as dataModels from "../data-models";
import {lyraDB} from "../lyra";
import {getQueryClient} from "../query";
import {ensureArray} from "../utils";

type DataModelType = keyof typeof dataModels;

const safeGetByID = async (type: DataModelType, docId: string) => {
    try {
        return await getByID(await lyraDB[type], docId);
    } catch (error) {
        console.error(
            "Memory LyraDB update strategy: Error getting doc from Lyra by ID.",
            {
                type,
                docId,
            },
        );
        console.error(error);
    }
};

interface AggregationObjectNode {
    insertions: Array<ResolveSchema<PropertiesSchema>>;
    removals: string[];
}

type AggregationObject = Partial<Record<DataModelType, AggregationObjectNode>>;

const aggregateOperation = async (
    operation: RecordOperation,
    aggregationObject: AggregationObject,
) => {
    if (["addRecord", "updateRecord"].some((op) => op === operation.op)) {
        const record = operation.record;
        const type = record.type as DataModelType;
        const id = record.id;
        const existingDoc = await safeGetByID(type, id);
        const docToBeInserted = dataModels[type].transformOrbitRecordToLyraDoc(
            record as never,
            existingDoc,
        );
        console.log({record, existingDoc, docToBeInserted});
        if (dequal(existingDoc, docToBeInserted)) return;
        aggregationObject[type] ??= {insertions: [], removals: []};
        aggregationObject[type].insertions.push(docToBeInserted);
        if (existingDoc != null) {
            aggregationObject[type].removals.push(id);
        }
    } else if (operation.op === "removeRecord") {
        const record = operation.record;
        const type = record.type as DataModelType;
        aggregationObject[type] ??= {insertions: [], removals: []};
        aggregationObject[type].removals.push(record.id);
    } else {
        console.warn(
            "Memory LyraDB update strategy: Unhandled operation:",
            operation.op,
            operation,
        );
    }
};

const processAggregationObjectNode = async (
    type: DataModelType,
    node: AggregationObjectNode,
) => {
    const unsafeToInsert: string[] = [];
    const db = await lyraDB[type];
    for (const docId of node.removals) {
        try {
            console.log("Memory LyraDB update strategy: Removing doc...", {
                type,
                docId,
            });
            await remove(db, docId);
            console.log("Memory LyraDB update strategy: Removal success.", {
                type,
                docId,
            });
        } catch (error) {
            console.log("Memory LyraDB update strategy: Removal error.", {
                type,
                docId,
            });
            console.error(error);
            unsafeToInsert.push(docId);
        }
    }
    const safeInsertions = node.insertions.filter(
        (doc) => !unsafeToInsert.includes(doc.id as string),
    );
    try {
        console.log("Memory LyraDB update strategy: Inserting batch...", {
            type,
            docs: safeInsertions,
        });
        await insertBatch(db, safeInsertions);
        console.log("Memory LyraDB update strategy: Batch insertion success.", {
            type,
            docs: safeInsertions,
        });
    } catch (error) {
        console.error("Memory LyraDB update strategy: Batch insertion error.", {
            type,
            docs: safeInsertions,
        });
        console.error(error);
    }
    if (node.insertions.length > 0 || node.removals.length > 0) {
        await getQueryClient().invalidateQueries(["search", type]);
    }
};

const memoryOnUpdate = async (transform: RecordTransform) => {
    try {
        console.log("MEMORY ON UPDATE:", transform);
        const aggregationObject: AggregationObject = {};
        for (const operation of ensureArray(transform.operations)) {
            await aggregateOperation(operation, aggregationObject);
        }
        for (const [type, node] of Object.entries(aggregationObject) as Array<
            [DataModelType, AggregationObjectNode]
        >) {
            await processAggregationObjectNode(type, node);
        }
    } catch (error) {
        console.error(error);
    }
};

export const addMemoryLyraDBUpdateStrategy = (memory: MemorySource) => {
    memory.on("update", (transform: RecordTransform) => {
        void memoryOnUpdate(transform);
    });
};
