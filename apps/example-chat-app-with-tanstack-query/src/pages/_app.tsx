import {QueryClientProvider} from "@tanstack/react-query";
import type {AppProps} from "next/app";
import Head from "next/head";

import {queryClient} from "../query";

import "../styles/global.css";

const App = ({Component, pageProps}: AppProps) => (
    <>
        <Head>
            <title>Example Chat App with Tanstack Query</title>
            <meta
                content={"initial-scale=1, minimum-scale=1, width=device-width"}
                name={"viewport"}
            />
        </Head>
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
        </QueryClientProvider>
    </>
);

export default App;
