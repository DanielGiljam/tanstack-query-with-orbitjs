const {join} = require("path");

module.exports = {
    extends: [
        "plugin:@nrwl/nx/react-typescript",
        "next",
        "next/core-web-vitals",
        "../../.eslintrc.json",
    ],
    ignorePatterns: [
        "!**/*",
        ".next/**/*",
        "src/prisma/client/**/*",
        ".eslintrc.js",
        "next-env.d.ts",
    ],
    overrides: [
        {
            files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
            parserOptions: {
                project: [
                    "apps/example-chat-app-with-tanstack-query-and-orbitjs/tsconfig(.*)?.json",
                ],
            },
            rules: {
                "@next/next/no-html-link-for-pages": [
                    "error",
                    "apps/example-chat-app-with-tanstack-query-and-orbitjs/src/pages",
                ],
                "import/no-extraneous-dependencies": [
                    "error",
                    {packageDir: [__dirname, join(__dirname, "../../")]},
                ],
            },
        },
        {
            files: ["*.ts", "*.tsx"],
            rules: {},
        },
        {
            files: ["*.js", "*.jsx"],
            rules: {},
        },
        {
            files: ["*.tsx", "*.jsx"],
            extends: ["@tanstack-query-with-orbitjs/jsx"],
        },
    ],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
    },
    env: {
        jest: true,
    },
};
