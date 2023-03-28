import {Box, CircularProgress, Theme, useMediaQuery} from "@mui/material";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import React from "react";

import {getQueryClient} from "../../query";

import {Drawer} from "./Drawer";
import {MobileAppBar} from "./MobileAppBar";
import {Note} from "./Note";

const queryClient = getQueryClient();

const drawerWidth = 240;

export const App = () => {
    const mobile = useMediaQuery<Theme>((theme) =>
        theme.breakpoints.down("md"),
    );
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [selectedNote, setSelectedNote] = React.useState<string>();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Box component={"header"} sx={{display: "contents"}}>
                <MobileAppBar
                    drawerWidth={drawerWidth}
                    handleDrawerToggle={handleDrawerToggle}
                    mobile={mobile}
                />
                <Box
                    component={"nav"}
                    sx={[
                        !mobile && {
                            width: drawerWidth,
                            flexShrink: 0,
                        },
                    ]}
                >
                    <Drawer
                        drawerWidth={drawerWidth}
                        handleDrawerToggle={handleDrawerToggle}
                        mobile={mobile}
                        mobileOpen={mobileOpen}
                        selectedNote={selectedNote}
                        setSelectedNote={setSelectedNote}
                    />
                </Box>
            </Box>
            <Box
                component={"main"}
                sx={[
                    {flexGrow: 1, overflowY: "auto", px: 2, py: 8},
                    !mobile && {
                        px: 8,
                        py: 6,
                        width: `calc(100% - ${drawerWidth}px)`,
                    },
                ]}
            >
                {selectedNote != null ? (
                    <Note key={selectedNote} id={selectedNote} />
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress sx={{mx: "auto"}} />
                    </Box>
                )}
            </Box>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};
