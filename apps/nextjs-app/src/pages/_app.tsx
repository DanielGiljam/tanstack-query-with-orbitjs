import {CacheProvider, EmotionCache} from "@emotion/react";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {AppProps as NextAppProps} from "next/app";
import Head from "next/head";

import {createEmotionCache, theme} from "../theme";

import "./styles.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface AppProps extends NextAppProps {
    emotionCache?: EmotionCache;
}

const App = ({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}: AppProps) => {
    return (
        <>
            <Head>
                <title>Welcome to nextjs-app!</title>
            </Head>
            <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <main className={"app"}>
                        <Component {...pageProps} />
                    </main>
                </ThemeProvider>
            </CacheProvider>
        </>
    );
};

export default App;
