import baseConfig from "@acme/eslint-config/base";
import vitestConfig from "@acme/eslint-config/vitest";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...vitestConfig,
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        projectService: false,
      },
    },
  },
];
