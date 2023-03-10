import {List} from "@mui/material";
import React from "react";

import {useNotes} from "../../hooks";

import {NoteListItem} from "./NoteListItem";

export interface NoteListProps {
    selectedNote: string | undefined;
    setSelectedNote: (id: string) => void;
}

export const NoteList = ({selectedNote, setSelectedNote}: NoteListProps) => {
    const {data} = useNotes({
        onSuccess: (notes) => {
            if (selectedNote == null) {
                setSelectedNote(notes[0].id);
            }
        },
        suspense: false,
    });
    return (
        <List
            sx={{flexGrow: 1, overflowY: data != null ? "auto" : "hidden"}}
            disablePadding
        >
            {(data ?? Array.from(Array(8), () => undefined)).map(
                (note, index) => (
                    <NoteListItem
                        key={note?.id ?? index}
                        note={note}
                        selectedNote={selectedNote}
                        setSelectedNote={setSelectedNote}
                    />
                ),
            )}
        </List>
    );
};
