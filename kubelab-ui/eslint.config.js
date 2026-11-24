import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default [
    { ignores: ["build/**", ".svelte-kit/**", "src/lib/pocketbase/generated-types.ts"] },
    js.configs.recommended,
    ...svelte.configs["flat/base"],
    {
        files: ["**/*.{js,ts,svelte}"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        plugins: { "@typescript-eslint": ts }
    },
    {
        files: ["**/*.ts"],
        languageOptions: { parser },
        rules: {
            ...ts.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off"
        }
    },
    {
        files: ["**/*.svelte"],
        languageOptions: { parserOptions: { parser } },
        rules: {
            "no-undef": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error"
        }
    },
    prettier
];
