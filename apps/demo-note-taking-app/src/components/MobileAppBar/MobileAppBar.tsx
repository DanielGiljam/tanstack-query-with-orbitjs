import MenuIcon from "@mui/icons-material/Menu";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";

export interface MobileAppBarProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
}

export const MobileAppBar = ({
    drawerWidth,
    handleDrawerToggle,
}: MobileAppBarProps) => {
    return (
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
                    Demo Note-Taking Application
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
