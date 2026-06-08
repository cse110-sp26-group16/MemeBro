import js from "@eslint/js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";

// Flat config (ESLint 10). Replaces the legacy .eslintrc.json and .eslintignore.
// node_modules and .git are ignored by ESLint's defaults; the rest below mirror
// the old .eslintignore so the linted file set is unchanged.
export default [
  {
    ignores: [
      ".github/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".next/**",
      "out/**",
      ".vscode/**",
      ".idea/**",
      "**/*.log",
      "research/**",
      "test-results/**",
      "js/vendor/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { jsdoc },
    rules: {
      // ESLint 9 changed the no-unused-vars caughtErrors default from "none" to
      // "all". Keep "none" so this migration stays behavior-neutral and does not
      // newly flag deliberately-ignored catch bindings (e.g. graceful fallbacks).
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrors: "none" }],
      "no-console": "off",
      eqeqeq: ["warn", "always"],
      curly: ["warn", "all"],
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-type": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-type": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/no-undefined-types": "error",
      "jsdoc/check-types": "error",
      "jsdoc/valid-types": "off",
      "jsdoc/check-tag-names": ["error", { definedTags: ["Template", "Caption", "Meme"] }],
    },
  },
];
