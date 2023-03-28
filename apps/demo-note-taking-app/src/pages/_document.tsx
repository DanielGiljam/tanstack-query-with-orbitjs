import createEmotionServer from "@emotion/server/create-instance";
import {getInitColorSchemeScript} from "@mui/material";
import NextDocument, {Head, Html, Main, NextScript} from "next/document";

import {createEmotionCache, roboto} from "../theme";

class Document extends NextDocument<{
    emotionStyleTags: JSX.Element[];
}> {
    render() {
        return (
            <Html className={roboto.className} lang={"en"}>
                <Head>
                    <meta content={""} name={"emotion-insertion-point"} />
                    {this.props.emotionStyleTags}
                </Head>
                <body>
                    {getInitColorSchemeScript({defaultMode: "dark"})}
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
Document.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const {extractCriticalToChunks} = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhanceApp(props) {
                    // @ts-expect-error In our case emotionCache is a valid prop that can be passed to the App component
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await NextDocument.getInitialProps(ctx);
    // This is important. It prevents Emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            key={style.key}
            dangerouslySetInnerHTML={{__html: style.css}}
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};

export default Document;
