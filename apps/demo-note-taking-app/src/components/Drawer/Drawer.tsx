import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
    Divider,
    IconButton,
    Drawer as MuiDrawer,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";

import {useAddNote} from "../../hooks";
import {NoteList} from "../NoteList";

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
                    Demo Note-Taking Application
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
                    }}
                    inputProps={{"aria-label": "search notes"}}
                    placeholder={"Search notes"}
                    size={"small"}
                    fullWidth
                />
            </Toolbar>
            <Divider />
            <NoteList
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
            />
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
