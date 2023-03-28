import {CacheProvider, EmotionCache} from "@emotion/react";
import {
    CssBaseline,
    Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material";
import {AppProps as NextAppProps} from "next/app";
import Head from "next/head";

import {Wrapper} from "../components";
import {createEmotionCache, theme} from "../theme";

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
                <title>Demo note-taking app</title>
            </Head>
            <CacheProvider value={emotionCache}>
                <CssVarsProvider defaultColorScheme={"dark"} theme={theme}>
                    <CssBaseline />
                    <Wrapper>
                        <Component {...pageProps} />
                    </Wrapper>
                </CssVarsProvider>
            </CacheProvider>
        </>
    );
};

export default App;
