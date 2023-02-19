import {useMutation, useQueryClient} from "@tanstack/react-query";

import {db} from "../dexie";

export interface UseAddNoteOptions {
    onSuccess?: (id: number) => void;
}

export const useAddNote = ({
    onSuccess = () => undefined,
}: UseAddNoteOptions = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const now = new Date();
            return await db.notes.add({
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
