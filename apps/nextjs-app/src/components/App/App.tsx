import MenuIcon from "@mui/icons-material/Menu";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";

const drawerWidth = 240;

export const App = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                }}
                variant={"dense"}
                disableGutters
            >
                <Typography component={"div"} variant={"h6"} noWrap>
                    Kantele
                </Typography>
                <IconButton
                    aria-label={"add note"}
                    color={"inherit"}
                    edge={"end"}
                    sx={{ml: 2}}
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
            <List disablePadding>
                {[
                    "Example note 1",
                    "Example note 2",
                    "Example note 3",
                    "Example note 4",
                ].map((text) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton dense disableTouchRipple divider>
                            <ListItemText
                                primary={text}
                                secondary={"Ipsum lorem"}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{display: "flex"}}>
            <Box component={"header"} sx={{display: "contents"}}>
                <AppBar
                    color={"inherit"}
                    component={"div"}
                    elevation={0}
                    position={"fixed"}
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        display: {sm: "none"},
                        ml: {sm: `${drawerWidth}px`},
                        width: {sm: `calc(100% - ${drawerWidth}px)`},
                    }}
                >
                    <Toolbar sx={{px: 2}} variant={"dense"} disableGutters>
                        <IconButton
                            aria-label={"open drawer"}
                            color={"inherit"}
                            edge={"start"}
                            sx={{mr: 2}}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography component={"div"} variant={"h6"} noWrap>
                            Kantele
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component={"nav"}
                    sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        open={mobileOpen}
                        sx={{
                            display: {xs: "block", sm: "none"},
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                        variant={"temporary"}
                        onClose={handleDrawerToggle}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        sx={{
                            display: {xs: "none", sm: "block"},
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                        variant={"permanent"}
                        open
                    >
                        {drawer}
                    </Drawer>
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
                <Typography paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Rhoncus dolor purus non enim praesent elementum
                    facilisis leo vel. Risus at ultrices mi tempus imperdiet.
                    Semper risus in hendrerit gravida rutrum quisque non tellus.
                    Convallis convallis tellus id interdum velit laoreet id
                    donec ultrices. Odio morbi quis commodo odio aenean sed
                    adipiscing. Amet nisl suscipit adipiscing bibendum est
                    ultricies integer quis. Cursus euismod quis viverra nibh
                    cras. Metus vulputate eu scelerisque felis imperdiet proin
                    fermentum leo. Mauris commodo quis imperdiet massa
                    tincidunt. Cras tincidunt lobortis feugiat vivamus at augue.
                    At augue eget arcu dictum varius duis at consectetur lorem.
                    Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                    sapien faucibus et molestie ac.
                </Typography>
                <Typography paragraph>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla
                    est ullamcorper eget nulla facilisi etiam dignissim diam.
                    Pulvinar elementum integer enim neque volutpat ac tincidunt.
                    Ornare suspendisse sed nisi lacus sed viverra tellus. Purus
                    sit amet volutpat consequat mauris. Elementum eu facilisis
                    sed odio morbi. Euismod lacinia at quis risus sed vulputate
                    odio. Morbi tincidunt ornare massa eget egestas purus
                    viverra accumsan in. In hendrerit gravida rutrum quisque non
                    tellus orci ac. Pellentesque nec nam aliquam sem et tortor.
                    Habitant morbi tristique senectus et. Adipiscing elit duis
                    tristique sollicitudin nibh sit. Ornare aenean euismod
                    elementum nisi quis eleifend. Commodo viverra maecenas
                    accumsan lacus vel facilisis. Nulla posuere sollicitudin
                    aliquam ultrices sagittis orci a.
                </Typography>
            </Box>
        </Box>
    );
};
