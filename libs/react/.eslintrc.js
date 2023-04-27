const {join} = require("path");

module.exports = {
    extends: ["../../.eslintrc.json"],
    ignorePatterns: ["!**/*", ".eslintrc.js"],
    overrides: [
        {
            files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
            parserOptions: {
                project: ["libs/react/tsconfig.*?.json"],
            },
            rules: {
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
    ],
};
