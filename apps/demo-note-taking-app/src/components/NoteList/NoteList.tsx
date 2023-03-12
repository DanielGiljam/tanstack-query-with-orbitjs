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
        onSuccess: (data) => {
            if (selectedNote == null) {
                setSelectedNote(data.pages[0][0].id);
            }
        },
        suspense: false,
    });
    return (
        <List
            sx={{flexGrow: 1, overflowY: data != null ? "auto" : "hidden"}}
            disablePadding
        >
            {(data?.pages[0] ?? Array.from(Array(8), () => undefined))
                .flat()
                .map((note, index) => (
                    <NoteListItem
                        key={note?.id ?? index}
                        note={note}
                        selectedNote={selectedNote}
                        setSelectedNote={setSelectedNote}
                    />
                ))}
        </List>
    );
};
