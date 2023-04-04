const {join} = require("path");

module.exports = {
    extends: [
        "plugin:@nrwl/nx/react-typescript",
        "next",
        "next/core-web-vitals",
        "../../.eslintrc.json",
    ],
    ignorePatterns: ["!**/*", ".next/**/*", "next-env.d.ts", ".eslintrc.js"],
    overrides: [
        {
            files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
            parserOptions: {
                project: [
                    "apps/typical-chat-app-with-react-query/tsconfig(.*)?.json",
                ],
            },
            rules: {
                "@next/next/no-html-link-for-pages": [
                    "error",
                    "apps/typical-chat-app-with-react-query/src/pages",
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
            extends: ["@offline-full-text-search-in-web-app/jsx"],
        },
    ],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
    },
    env: {
        jest: true,
    },
};
