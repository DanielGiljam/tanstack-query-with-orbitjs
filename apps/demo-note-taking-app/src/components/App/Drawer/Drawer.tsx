import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
    CircularProgress,
    Divider,
    IconButton,
    Drawer as MuiDrawer,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";

import {useAddNote} from "../../../hooks";
import {NoteList} from "../NoteList";
import {SearchResultList} from "../SearchResultList";

export interface DrawerProps {
    mobile: boolean;
    mobileOpen: boolean;
    drawerWidth: number;
    handleDrawerToggle: () => void;
    selectedNote: string | undefined;
    setSelectedNote: (id: string) => void;
}

export const Drawer = ({
    mobile,
    mobileOpen,
    drawerWidth,
    handleDrawerToggle,
    selectedNote,
    setSelectedNote,
}: DrawerProps) => {
    const {mutate} = useAddNote({
        onSuccess: (note) => setSelectedNote(note.id),
    });
    const [searchTerm, setSearchTerm] = React.useState("");
    const deferredSearchTerm = React.useDeferredValue(searchTerm);
    const searching = searchTerm !== deferredSearchTerm;
    const drawer = (
        <>
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                }}
                variant={"dense"}
                disableGutters
            >
                <Typography component={"div"} variant={"h6"} noWrap>
                    Notes
                </Typography>
                <IconButton
                    aria-label={"add note"}
                    color={"inherit"}
                    edge={"end"}
                    sx={{ml: 2}}
                    onClick={() => mutate()}
                >
                    <NoteAddIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <Toolbar
                sx={{
                    px: 2,
                }}
                disableGutters
            >
                <TextField
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ml: -1, mr: 0.25}} />,
                        endAdornment: searching && (
                            <CircularProgress size={24} />
                        ),
                    }}
                    inputProps={{"aria-label": "search notes"}}
                    placeholder={"Search notes"}
                    size={"small"}
                    value={searchTerm}
                    fullWidth
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </Toolbar>
            <Divider />
            {deferredSearchTerm.length > 0 ? (
                <SearchResultList
                    searchTerm={deferredSearchTerm}
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                />
            ) : (
                <NoteList
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                />
            )}
        </>
    );
    return mobile ? (
        <MuiDrawer
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            open={mobileOpen}
            sx={{
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                },
            }}
            variant={"temporary"}
            disablePortal
            onClose={handleDrawerToggle}
        >
            {drawer}
        </MuiDrawer>
    ) : (
        <MuiDrawer
            sx={{
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                },
            }}
            variant={"permanent"}
            open
        >
            {drawer}
        </MuiDrawer>
    );
};
