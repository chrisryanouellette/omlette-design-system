module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    JSX: "readonly",
  },
  extends: ["eslint-config-omlette", "plugin:storybook/recommended"],
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
    "spaced-comment": [
      "error",
      "always",
      {
        markers: ["/"],
      },
    ],
    "require-jsdoc": 0,
    "valid-jsdoc": 0,
  },
  overrides: [
    {
      files: ["*.cjs", "*.js"],
      rules: {
        "no-undef": 0,
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
      },
    },
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off",
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
          ["@Utilities", "./src/utilities"],
          ["@Lib", "./src/lib"],
          ["@Components", "./src/components"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
};
