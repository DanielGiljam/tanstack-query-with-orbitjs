// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});
const {withNx} = require("@nrwl/next/plugins/with-nx");

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    basePath: "/offline-full-text-search-in-web-app/demo-note-taking-app",
    env: {
        testDataUrl: process.env.TEST_DATA_URL ?? "/test-data.json",
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    nx: {
        // Set this to true if you would like to to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: true,
    },
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = withBundleAnalyzer(withNx(nextConfig));
