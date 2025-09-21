// @ts-check
import { withNuxt } from "./.nuxt/eslint.config.mjs";
import vueParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";

export default withNuxt([
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],
  { ignores: ["**/node_modules/**", "**/dist/**"] },
  {
    files: ["{agent,app,packages,server,shared}**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {},
  },
  {
    files: ["app/**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        parser: {
          js: "espree",
          ts: tseslint.parser,
        },
      },
    },
    rules: {},
  },
]);
