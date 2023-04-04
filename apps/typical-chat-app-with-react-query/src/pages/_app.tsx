import {QueryClientProvider} from "@tanstack/react-query";
import type {AppProps} from "next/app";

import {queryClient} from "../query";

import "../styles/global.css";

const App = ({Component, pageProps}: AppProps) => (
    <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
    </QueryClientProvider>
);

export default App;
