import {useMutation, useQueryClient} from "@tanstack/react-query";
import {v4 as uuidv4} from "uuid";

import {db} from "../dexie";

export interface UseAddNoteOptions {
    onSuccess?: (id: string) => void;
}

export const useAddNote = ({
    onSuccess = () => undefined,
}: UseAddNoteOptions = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const now = new Date();
            return await db.notes.add({
                id: uuidv4(),
                created_at: now,
                updated_at: now,
                title: "",
                contents: "",
            });
        },
        onSuccess: async (id) => {
            await queryClient.invalidateQueries(["notes"]);
            onSuccess(id);
        },
    });
};
