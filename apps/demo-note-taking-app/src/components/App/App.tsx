import {Box, CircularProgress} from "@mui/material";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import React from "react";

import {getQueryClient} from "../../query";
import {Drawer} from "../Drawer";
import {MobileAppBar} from "../MobileAppBar";
import {Note} from "../Note";

const queryClient = getQueryClient();

const drawerWidth = 240;

export const App = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [selectedNote, setSelectedNote] = React.useState<string>();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Box sx={{display: "flex"}}>
                <Box component={"header"} sx={{display: "contents"}}>
                    <MobileAppBar
                        drawerWidth={drawerWidth}
                        handleDrawerToggle={handleDrawerToggle}
                    />
                    <Box
                        component={"nav"}
                        sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                    >
                        <Drawer
                            drawerWidth={drawerWidth}
                            handleDrawerToggle={handleDrawerToggle}
                            mobileOpen={mobileOpen}
                            selectedNote={selectedNote}
                            setSelectedNote={setSelectedNote}
                        />
                    </Box>
                </Box>
                <Box
                    component={"main"}
                    sx={{
                        flexGrow: 1,
                        px: {xs: 2, sm: 8},
                        py: {xs: 8, sm: 6},
                        width: {sm: `calc(100% - ${drawerWidth}px)`},
                    }}
                >
                    {selectedNote != null ? (
                        <Note key={selectedNote} id={selectedNote} />
                    ) : (
                        <Box sx={{display: "flex", justifyContent: "center"}}>
                            <CircularProgress sx={{mx: "auto"}} />
                        </Box>
                    )}
                </Box>
            </Box>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};
