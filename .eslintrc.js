module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    JSX: "readonly",
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:import/recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:import/typescript",
    "plugin:testing-library/react",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 2,
    "import/order": 2,
    "spaced-comment": [
      "error",
      "always",
      {
        markers: ["/"],
      },
    ],
    "require-jsdoc": 0,
  },
  overrides: [
    {
      files: ["*.cjs", "*.js"],
      rules: {
        "no-undef": 0,
        "@typescript-eslint/no-var-requires": 0,
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"],
    },
    "import/resolver": {
      alias: {
        map: [
          ["@Storybook", "./storybook"],
          ["@Utilities", "./utilities"],
          ["@Components", "./components"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
};
