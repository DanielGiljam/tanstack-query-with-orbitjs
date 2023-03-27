import {search} from "@lyrasearch/lyra";
import {useQuery} from "@tanstack/react-query";

import {lyraDB} from "../lyra";

export const useSearchNotes = (term: string) =>
    useQuery({
        queryKey: ["search", "note", term] as const,
        queryFn: async (ctx) => {
            await new Promise((resolve) => setTimeout(resolve, 0));
            const results = await search(await lyraDB.note, {
                term: ctx.queryKey[2],
                properties: ["title", "content"],
            });
            console.log("results", results);
            return results;
        },
        enabled: term.length > 0,
    });
