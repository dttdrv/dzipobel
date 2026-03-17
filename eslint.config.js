import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist", "node_modules", ".astro", "_scaffold-trash"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        Buffer: "readonly",
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.{spec,test}.{ts,mjs}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
];
