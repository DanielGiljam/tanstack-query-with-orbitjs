import {Dexie} from "dexie";

export interface Note {
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    contents: string;
}

class Kantele extends Dexie {
    notes!: Dexie.Table<Note, string>;

    constructor() {
        super("kantele");
        this.version(1).stores({
            notes: "id, created_at, updated_at, title, contents",
        });
    }
}

export const db = new Kantele();
