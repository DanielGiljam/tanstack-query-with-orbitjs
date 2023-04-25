import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import type {AppProps} from "next/app";
import Head from "next/head";

import {queryClient} from "../query";

import "../styles/global.css";

const App = ({Component, pageProps}: AppProps) => (
    <>
        <Head>
            <title>Example Chat App with Tanstack Query and Orbit.js</title>
            <meta
                content={"initial-scale=1, minimum-scale=1, width=device-width"}
                name={"viewport"}
            />
        </Head>
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </QueryClientProvider>
    </>
);

export default App;
