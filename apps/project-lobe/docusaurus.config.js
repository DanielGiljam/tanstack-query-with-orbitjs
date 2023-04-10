// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const lightCodeTheme = require("prism-react-renderer/themes/github");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Project Fly-By-Wire",
    tagline:
        "Coming up with a solution for better being able to develop better data-heavy web applications",
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
