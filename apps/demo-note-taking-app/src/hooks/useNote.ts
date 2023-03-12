import {Note} from "../orbit";

import {useQueryWithInitialData} from "./useQueryWithInitialData";

export const useNote = (id: string | undefined) =>
    useQueryWithInitialData<Note>({
        queryKey: ["note", id],
        enabled: id != null,
        meta: {
            getQueryOrExpressions:
                ([, id]) =>
                (q) =>
                    q.findRecord({type: "note", id: id as string}),
        },
    });
