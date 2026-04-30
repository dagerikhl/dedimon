import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

const sourceFiles = ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];

const config = [
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
  {
    name: "next/core-web-vitals",
    files: sourceFiles,
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    name: "react-hooks/recommended-latest",
    files: sourceFiles,
    plugins: { "react-hooks": reactHooksPlugin },
    rules: reactHooksPlugin.configs["recommended-latest"].rules,
  },
  {
    ...tseslint.configs.base,
    files: ["**/*.{ts,tsx,mts,cts}"],
  },
  prettier,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
