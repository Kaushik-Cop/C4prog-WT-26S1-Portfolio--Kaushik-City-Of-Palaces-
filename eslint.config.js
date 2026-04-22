export default [
  {
    ignores: ["eslint.config.js", "node_modules/**"]
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly"
      }
    },
    rules: {}
  }
];
