// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const lightCodeTheme = require("prism-react-renderer/themes/github");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Project Fly-By-Wire",
    tagline:
        "A meta-framework for building web applications that deal with rapidly changing relational data.",
    url: process.env.DOCUSAURUS_URL || "http://localhost:3000",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "/icon.svg",
    organizationName: "DanielGiljam", // Usually your GitHub org/user name.
    projectName: "offline-full-text-search-in-web-app", // Usually your repo name.

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: "/",
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/DanielGiljam/offline-full-text-search-in-web-app/tree/main/apps/project-lobe/docs/",
                },
                blog: false,
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: "Project Fly-By-Wire",
            },
            footer: {
                style: "dark",
                copyright: `Copyright © ${new Date().getFullYear()} Daniel Giljam.`,
            },
            colorMode: {
                disableSwitch: true,
                respectPrefersColorScheme: true,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
