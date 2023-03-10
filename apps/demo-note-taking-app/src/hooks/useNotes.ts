import {useQuery} from "@tanstack/react-query";

import {Note} from "../orbit";

export interface UseNotesOptions {
    onSuccess?: (notes: Note[]) => void;
    suspense?: boolean;
}

export const useNotes = ({
    onSuccess = () => undefined,
    suspense = true,
}: UseNotesOptions = {}) =>
    useQuery<Note[]>({
        queryKey: ["notes"],
        onSuccess,
        suspense,
        meta: {
            getQueryOrExpressions: () => (q) =>
                q.findRecords("note").sort("-updated_at"),
            keepAlive: true,
        },
    });
