// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />

import {defineConfig} from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    cacheDir: "../../node_modules/.vite/react",

    plugins: [
        viteTsConfigPaths({
            root: "../../",
        }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    test: {
        globals: true,
        cache: {
            dir: "../../node_modules/.vitest",
        },
        environment: "jsdom",
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
