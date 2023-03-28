import GitHubIcon from "@mui/icons-material/GitHub";
import {Box, Button, Link, Typography} from "@mui/material";

import {ReactComponent as LogomarkAndLogotype} from "../../../assets/logomark-and-logotype.svg";

const pageMinHeight = 1004;
const appContainerMaxHeight = 661;

export interface WrapperProps {
    children: React.ReactNode;
}

export const Wrapper = ({children}: WrapperProps) => {
    return (
        <Box
            sx={{
                height: "100vh",
                overflowY: "auto",
                scrollSnapType: {
                    xs: "y mandatory",
                    md: "none",
                },
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: {md: "100vh"},
                    gap: 4,
                    minHeight: {md: pageMinHeight},
                    px: 4,
                }}
            >
                <Box
                    sx={{
                        maxWidth: (theme) =>
                            theme.breakpoints.values.sm -
                            parseFloat(theme.spacing(8)),
                        pt: 4,
                        scrollSnapAlign: "start",
                        "& .logomark-and-logotype": {
                            maxHeight: "4rem",
                        },
                    }}
                >
                    <LogomarkAndLogotype className={"logomark-and-logotype"} />
                    <Typography
                        sx={{
                            fontSize: "1.75rem",
                            lineHeight: 1,
                            mt: 2,
                            textAlign: "center",
                        }}
                        variant={"h1"}
                    >
                        Demo note-taking app
                    </Typography>
                    <Typography
                        sx={{lineHeight: 1, mt: 2, textAlign: "center"}}
                    >
                        Demonstrates offline full-text search in a web app
                    </Typography>
                    <Box
                        data-mui-color-scheme={"light"}
                        sx={{mt: 4, textAlign: "center"}}
                    >
                        <Button
                            color={"inherit"}
                            href={
                                "https://github.com/DanielGiljam/offline-full-text-search-in-web-app"
                            }
                            startIcon={<GitHubIcon />}
                            sx={{
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                color: "text.primary",
                                typography: "body1",
                                textTransform: "none",
                            }}
                            variant={"contained"}
                        >
                            Source code on GitHub
                        </Button>
                    </Box>
                </Box>
                <Box
                    data-mui-color-scheme={"light"}
                    sx={{
                        bgcolor: "background.paper",
                        borderRadius: {
                            xs: 0,
                            md: 2,
                        },
                        display: "flex",
                        contain: "strict",
                        overflow: "hidden",
                        maxWidth: (theme) => ({
                            md:
                                theme.breakpoints.values.md -
                                parseFloat(theme.spacing(8)),
                        }),
                        maxHeight: {md: appContainerMaxHeight},
                        scrollSnapAlign: "start",
                        width: (theme) => ({
                            xs: `calc(100% + ${theme.spacing(8)})`,
                            md: 1,
                        }),
                        height: {xs: "100vh", md: 1},
                    }}
                >
                    {children}
                </Box>
                <Box sx={{pb: 4, scrollSnapAlign: "end"}}>
                    <Typography sx={{lineHeight: 1}}>
                        © 2023 Daniel Giljam.{" "}
                        <Link
                            color={"inherit"}
                            href={
                                "https://github.com/DanielGiljam/offline-full-text-search-in-web-app/blob/main/LICENSE"
                            }
                            underline={"hover"}
                        >
                            MIT License
                        </Link>
                        .
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
