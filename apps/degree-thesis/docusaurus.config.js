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
                items: [
                    {
                        type: "html",
                        position: "right",
                        value: `
                            <a href="https://www.theseus.fi/handle/10024/800032" target="_blank" rel="noopener noreferrer" class="navbar__link" aria-label="Thesis publication on theseus.fi" style="display: flex; width: 24px; height: 24px;">
                                <svg viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" role="decoration">
                                    <path d="M1 44v43h86V1H20.2l.2 33.2.1 33.3h47l.2-23.6.2-23.6-14.2.1-14.2.1v27.6l4.5-.3 4.5-.3.1-7c.2-12.6-.3-11.6 5.4-11.4l4.9.3v14.8L59 59H29.2V10H78l.1 2.2c.3 12.6 0 65-.4 65.4-.4.5-52 .8-65.2.5l-3-.1.2-38.5L9.8 1H1v43z" fill="currentColor"/>
                                </svg>
                            </a>
                        `,
                    },
                    {
                        type: "html",
                        position: "right",
                        value: `
                            <a href="https://github.com/DanielGiljam/tanstack-query-with-orbitjs" target="_blank" rel="noopener noreferrer" class="navbar__link" aria-label="GitHub repository" style="display: flex; width: 24px; height: 24px;">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="decoration">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>
                                </svg>
                            </a>
                        `,
                    },
                ],
            },
            footer: {
                style: "dark",
                copyright: "Copyright © 2023 Daniel Giljam.",
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
