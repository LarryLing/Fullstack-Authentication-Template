import { reactConfig } from "@fullstack-template/eslint-config/react";

/** @type {import("eslint").Linter.Config} */
export default [
  ...reactConfig,
  {
    ignores: ["src/components/ui/**"], // Ignore linting ShadCN/ui components
  }
];
