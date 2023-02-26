import {useMutation, useQueryClient} from "@tanstack/react-query";

import {Note, db} from "../dexie";

export interface UseUpdateNoteOptions {
    id: string;
}

export const useUpdateNote = ({id}: UseUpdateNoteOptions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (update: {title?: string; contents?: string}) =>
            await db.notes.update(id, {...update, updated_at: new Date()}),
        onMutate: async (update) => {
            await queryClient.cancelQueries(["note", id]);
            const previousNote = queryClient.getQueryData<Note>(["note", id]);
            if (previousNote != null) {
                queryClient.setQueryData(["note", id], {
                    ...previousNote,
                    ...update,
                    updated_at: new Date(),
                });
            } else {
                void queryClient.invalidateQueries(["note", id]);
            }
            return {previousNote};
        },
        onSuccess: () => {
            void queryClient.invalidateQueries(["note", id]);
            void queryClient.invalidateQueries(["notes"]);
        },
    });
};
