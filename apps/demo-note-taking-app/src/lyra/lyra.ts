import {Lyra, PropertiesSchema, create} from "@lyrasearch/lyra";
import {persist, restore} from "@lyrasearch/plugin-data-persistence";
import {get, set} from "idb-keyval";

import * as dataModels from "../data-models";

const restoreOrCreateLyraDB = async (key: string, schema: PropertiesSchema) => {
    if (typeof window !== "undefined") {
        let db: Lyra<PropertiesSchema>;
        try {
            console.log("LyraDB: Restoring data...");
            const data = await get(`lyra_db_${key}`);
            db = await restore("json", data as Buffer);
            console.log("LyraDB: Data restored.");
        } catch (error) {
            console.error("LyraDB: Failed to restore data.");
            console.error(error);
            db = await create({schema});
        }
        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                void (async () => {
                    try {
                        console.log("LyraDB: Persisting data...");
                        const data = await persist(db, "json");
                        await set(`lyra_db_${key}`, data);
                        console.log("LyraDB: Data persisted.");
                    } catch (error) {
                        console.error("LyraDB: Failed to persist data.");
                        console.error(error);
                    }
                })();
            }
        });
        return db;
    }
};

export const lyraDB = Object.fromEntries(
    Object.entries(dataModels).map(([key, value]) => [
        key,
        restoreOrCreateLyraDB(key, value.lyraSchema),
    ]),
) as {
    [K in keyof typeof dataModels]: Promise<
        Lyra<(typeof dataModels)[K]["lyraSchema"]>
    >;
};
