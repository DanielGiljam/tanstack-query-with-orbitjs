import MemorySource from "@orbit/memory";
import {useMutation} from "@tanstack/react-query";

import {Note, getCoordinator} from "../orbit";

export interface UseAddNoteOptions {
    onSuccess?: (note: Note) => void;
}

export const useAddNote = ({
    onSuccess = () => undefined,
}: UseAddNoteOptions = {}) =>
    useMutation({
        mutationFn: async () => {
            const now = new Date();
            const coordinator = await getCoordinator();
            return await coordinator
                .getSource<MemorySource>("memory")
                .update<Note>((t) =>
                    t.addRecord({
                        type: "note",
                        attributes: {
                            title: "",
                            content: "",
                            created_at: now,
                            updated_at: now,
                        },
                    }),
                );
        },
        onSuccess: async (note) => {
            console.log("note (updateNote):", note);
            onSuccess(note);
        },
    });
