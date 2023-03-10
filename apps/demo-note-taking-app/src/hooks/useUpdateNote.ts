import {MemorySource} from "@orbit/memory";
import {useMutation} from "@tanstack/react-query";

import {getCoordinator} from "../orbit";

export const useUpdateNote = () =>
    useMutation({
        mutationFn: async ({
            id,
            ...update
        }: {
            id: string;
            title?: string;
            content?: string;
        }) => {
            const now = new Date();
            const coordinator = await getCoordinator();
            return await coordinator
                .getSource<MemorySource>("memory")
                .update((t) =>
                    t.updateRecord({
                        type: "note",
                        id,
                        attributes: {...update, updated_at: now},
                    }),
                );
        },
    });
