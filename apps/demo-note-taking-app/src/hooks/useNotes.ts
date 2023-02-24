import {useQuery} from "@tanstack/react-query";

import {db} from "../dexie";

export const useNotes = () =>
    useQuery({
        queryKey: ["notes"],
        queryFn: async () =>
            await db.notes.orderBy("updated_at").reverse().toArray(),
    });
