// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {withNx} = require("@nrwl/next/plugins/with-nx");

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    nx: {
        // Set this to true if you would like to to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: true,
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = withNx(nextConfig);
