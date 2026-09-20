import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@excalimath$/,
        replacement: path.resolve(__dirname, "../packages/excalimath/src/index.ts"),
      },
      {
        find: /^@excalimath\/(.*?)/,
        replacement: path.resolve(__dirname, "../packages/excalimath/src/$1"),
      },
    ],
  },
  test: {
    sequence: {
      hooks: "parallel",
    },
    setupFiles: ["./setupTests.ts"],
    globals: true,
    environment: "jsdom",
    hideSkippedTests: true,
  },
});
