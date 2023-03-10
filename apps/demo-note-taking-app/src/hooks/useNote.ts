import {useQuery} from "@tanstack/react-query";

import {Note} from "../orbit";

export const useNote = (id: string | undefined) =>
    useQuery<Note>({
        queryKey: ["note", id],
        enabled: id != null,
        meta: {
            getQueryOrExpressions:
                ([, id]) =>
                (q) =>
                    q.findRecord({type: "note", id: id as string}),
        },
    });
