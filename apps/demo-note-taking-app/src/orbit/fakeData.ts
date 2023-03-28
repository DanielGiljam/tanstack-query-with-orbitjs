import {faker} from "@faker-js/faker";
import {Coordinator} from "@orbit/coordinator";
import MemorySource from "@orbit/memory";
import {get, set} from "idb-keyval";

export const maybeLoadFakeData = async (coordinator: Coordinator) => {
    if ((await get<boolean>("loaded_fake_data")) === true) {
        console.log("Fake data: already loaded.");
    } else {
        try {
            console.log("Fake data: not loaded.");
            console.log("Fake data: loading...");
            const response = await fetch("test-data.json");
            const data = (await response.json()) as Array<{
                title: string;
                content: string;
            }>;

            await coordinator.getSource<MemorySource>("memory").update((t) =>
                data.map(({title, content}) => {
                    /* eslint-disable @typescript-eslint/naming-convention */
                    const updated_at = faker.date.past();
                    const created_at = faker.date.past(undefined, updated_at);
                    /* eslint-enable @typescript-eslint/naming-convention */
                    return t.addRecord({
                        type: "note",
                        attributes: {title, content, created_at, updated_at},
                    });
                }),
            );
            await set("loaded_fake_data", true);
            console.log("Fake data: loading success.");
        } catch (error) {
            console.error("Fake data: loading error.");
            console.error(error);
        }
    }
};
