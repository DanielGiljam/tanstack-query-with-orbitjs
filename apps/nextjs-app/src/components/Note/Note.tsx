import {Skeleton, TextField} from "@mui/material";

import {useNote} from "../../hooks";

export interface NoteProps {
    id: string | undefined;
}

export const Note = ({id}: NoteProps) => {
    const {data} = useNote(id);
    if (data == null) {
        return (
            <>
                <Skeleton
                    height={56}
                    sx={{mb: 2}}
                    variant={"rounded"}
                    width={"100%"}
                />
                <Skeleton height={493} variant={"rounded"} width={"100%"} />
            </>
        );
    }
    return (
        <>
            <TextField
                inputProps={{"aria-label": "note title"}}
                placeholder={"Untitled"}
                sx={{mb: 2}}
                value={data.title}
                fullWidth
            />
            <TextField
                inputProps={{"aria-label": "note contents"}}
                minRows={20}
                placeholder={"No contents"}
                value={data.contents}
                fullWidth
                multiline
            />
        </>
    );
};
