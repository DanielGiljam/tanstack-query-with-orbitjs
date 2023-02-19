import {List, ListItem, ListItemButton, ListItemText} from "@mui/material";

import {useNotes} from "../../hooks";

export interface NoteListProps {
    selectedNote: string | undefined;
    setSelectedNote: (id: string) => void;
}

export const NoteList = ({selectedNote, setSelectedNote}: NoteListProps) => {
    const {data} = useNotes();
    return (
        <List disablePadding>
            {data?.map(({id, title, contents}) => {
                const noTitle = title.length === 0;
                const noContents = contents.length === 0;
                return (
                    <ListItem key={id} disablePadding>
                        <ListItemButton
                            selected={id === selectedNote}
                            dense
                            disableTouchRipple
                            divider
                            onClick={() => setSelectedNote(id)}
                        >
                            <ListItemText
                                primary={noTitle ? "Untitled" : title}
                                primaryTypographyProps={
                                    noTitle
                                        ? {sx: {fontStyle: "italic"}}
                                        : undefined
                                }
                                secondary={
                                    noContents ? "No contents" : contents
                                }
                                secondaryTypographyProps={
                                    noContents
                                        ? {sx: {fontStyle: "italic"}}
                                        : undefined
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};
