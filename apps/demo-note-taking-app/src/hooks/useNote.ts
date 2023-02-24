import {useQuery} from "@tanstack/react-query";

import {db} from "../dexie";

export const useNote = (id: string | undefined) =>
    useQuery({
        queryKey: ["note", id] as const,
        queryFn: async (ctx) => await db.notes.get(ctx.queryKey[1]!),
        enabled: id != null,
    });
