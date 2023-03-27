import {TextField} from "@mui/material";
import React from "react";

import {useDebounce, useNote, useUpdateNote} from "../../../hooks";

export interface NoteProps {
    id: string | undefined;
}

export const Note = ({id}: NoteProps) => {
    const {data} = useNote(id);
    const {mutate} = useUpdateNote();
    const debouncedMutate = useDebounce(mutate, 500);
    const [title, setTitle] = React.useState(data!.attributes.title);
    const [content, setContent] = React.useState(data!.attributes.content);
    return (
        <>
            <TextField
                inputProps={{"aria-label": "note title"}}
                placeholder={"Untitled"}
                sx={{mb: 2}}
                value={title}
                fullWidth
                onChange={(event) => {
                    setTitle(event.target.value);
                    debouncedMutate({id: id!, title: event.target.value});
                }}
            />
            <TextField
                inputProps={{"aria-label": "note content"}}
                minRows={20}
                placeholder={"No content"}
                value={content}
                fullWidth
                multiline
                onChange={(event) => {
                    setContent(event.target.value);
                    debouncedMutate({id: id!, content: event.target.value});
                }}
            />
        </>
    );
};
