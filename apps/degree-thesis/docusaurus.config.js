// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const lightCodeTheme = require("prism-react-renderer/themes/github");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Making TanStack Query feel more like the Cloud Firestore client-side SDK",
    url: process.env.DOCUSAURUS_URL || "http://localhost:3000",
    baseUrl: "/degree-thesis/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "../icon.svg",
    organizationName: "DanielGiljam", // Usually your GitHub org/user name.
    projectName: "tanstack-query-with-orbitjs", // Usually your repo name.

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
                        "https://github.com/DanielGiljam/tanstack-query-with-orbitjs/tree/main/apps/degree-thesis/docs/",
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
                title: "Making TanStack Query feel more like the Cloud Firestore client-side SDK",
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
                // From https://github.com/backstage/backstage/pull/16664
                magicComments: [
                    // Extend the default highlight class name
                    {
                        className: "theme-code-block-highlighted-line",
                        line: "highlight-next-line",
                        block: {
                            start: "highlight-start",
                            end: "highlight-end",
                        },
                    },
                    {
                        className: "code-block-add-line",
                        line: "highlight-add-next-line",
                        block: {
                            start: "highlight-add-start",
                            end: "highlight-add-end",
                        },
                    },
                    {
                        className: "code-block-remove-line",
                        line: "highlight-remove-next-line",
                        block: {
                            start: "highlight-remove-start",
                            end: "highlight-remove-end",
                        },
                    },
                ],
            },
        }),
};

module.exports = config;
