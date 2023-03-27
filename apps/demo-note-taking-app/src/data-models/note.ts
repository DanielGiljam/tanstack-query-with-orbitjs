import {ResolveSchema} from "@lyrasearch/lyra";
import {InitializedRecord} from "@orbit/records";

export interface Note extends InitializedRecord {
    type: "note";
    attributes: {
        title: string;
        content: string;
        created_at: Date;
        updated_at: Date;
    };
}

export const note = {
    orbitSchema: {
        attributes: {
            title: {type: "string"},
            content: {type: "string"},
            created_at: {type: "datetime"},
            updated_at: {type: "datetime"},
        },
    },
    lyraSchema: {
        title: "string",
        content: "string",
    },
    lyraDefaults: {
        title: "",
        content: "",
    },
    transformOrbitRecordToLyraDoc(
        note: Note,
        existingDoc?: ResolveSchema<typeof this.lyraSchema>,
    ) {
        return {
            id: note.id,
            title: note.attributes.title ?? existingDoc?.title ?? "",
            content: note.attributes.content ?? existingDoc?.content ?? "",
        };
    },
} as const;
