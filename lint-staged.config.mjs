const config = {
  "*.{js,jsx,ts,tsx,cjs,mjs}": ["eslint --fix", "prettier -w"],
  "*.{js,jsx,ts,tsx,cjs,mjs,json,css,md,yml,yaml}": "prettier -w",
};

export default config;
