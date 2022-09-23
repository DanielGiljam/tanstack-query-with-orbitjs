require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    extends: ["standard-jsx", "prettier"],
    rules: {
        "react/jsx-curly-brace-presence": [
            "warn",
            {props: "always", children: "never"},
        ],
        "react/jsx-sort-props": [
            "warn",
            {
                callbacksLast: true,
                shorthandLast: true,
                ignoreCase: true,
                reservedFirst: true,
            },
        ],
    },
};
