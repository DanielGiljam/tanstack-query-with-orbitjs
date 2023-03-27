import {RetrievedDoc} from "@lyrasearch/lyra";
import {
    CircularProgress,
    LinearProgress,
    ListItem,
    ListItemButton,
    ListItemText,
    Skeleton,
} from "@mui/material";
import React from "react";

import {Note, note} from "../../../data-models";
import {VirtualListItemProps} from "../../VirtualList";

export const NOTE_LIST_ITEM_DATA_LOADING = Symbol("loading");

export type NoteListItemData =
    | Note
    | RetrievedDoc<typeof note.lyraSchema>
    | typeof NOTE_LIST_ITEM_DATA_LOADING;

export const NoteListItem = React.memo(
    React.forwardRef<
        HTMLLIElement,
        VirtualListItemProps<
            NoteListItemData,
            {
                selected: boolean;
                setSelectedNote: (id: string) => void;
            }
        >
    >(({data, index, selected, setSelectedNote}, ref) => {
        const [isPending, startTransition] = React.useTransition();
        if (data === NOTE_LIST_ITEM_DATA_LOADING) {
            return (
                <ListItem
                    ref={ref}
                    data-index={index}
                    sx={{justifyContent: "center"}}
                >
                    <CircularProgress />
                </ListItem>
            );
        }
        const id = data.id;
        let title, content;
        if ("attributes" in data) {
            title = data.attributes.title;
            content = data.attributes.content;
        } else {
            title = data.document.title;
            content = data.document.content;
        }
        return (
            <ListItem ref={ref} data-index={index} disablePadding>
                <ListItemButton
                    selected={selected}
                    dense
                    disableTouchRipple
                    divider
                    onClick={() => {
                        if (id != null) {
                            startTransition(() => setSelectedNote(id));
                        }
                    }}
                >
                    {isPending && (
                        <LinearProgress
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                    )}
                    <ListItemText
                        primary={
                            title != null ? (
                                title.length === 0 ? (
                                    "Untitled"
                                ) : (
                                    title
                                )
                            ) : (
                                <Skeleton />
                            )
                        }
                        primaryTypographyProps={{
                            noWrap: true,
                            sx: [title?.length === 0 && {fontStyle: "italic"}],
                        }}
                        secondary={
                            content != null ? (
                                content.length === 0 ? (
                                    "No content"
                                ) : (
                                    content
                                )
                            ) : (
                                <Skeleton />
                            )
                        }
                        secondaryTypographyProps={{
                            sx: [
                                {
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: "3",
                                },
                                content?.length === 0 && {fontStyle: "italic"},
                            ],
                        }}
                    />
                </ListItemButton>
            </ListItem>
        );
    }),
);
