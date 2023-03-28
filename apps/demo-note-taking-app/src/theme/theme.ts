import {experimental_extendTheme as extendTheme} from "@mui/material";
import {Inter} from "@next/font/google";
import {grassDark} from "@radix-ui/colors";

export const roboto = Inter({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["system-ui", "sans-serif"],
});

// Create a theme instance.
export const theme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                background: {
                    default: grassDark.grass2,
                },
            },
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});
