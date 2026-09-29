import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import pkg from "./package.json" with { type: "json" };

// test:dev and test:prod differ only in __DEV__ (`--mode development|production`). NODE_ENV stays "test" in
// both: with NODE_ENV=production React has no act() and its context objects differ from the public API snapshot.
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  return {
    // The source uses the classic React.createElement runtime, like the build. oxc infers the language from the extension.
    oxc: {
      include: /\.[jt]sx?$/,
      jsx: { runtime: "classic", pragma: "React.createElement", pragmaFrag: "React.Fragment" },
    },
    define: {
      __DEV__: JSON.stringify(!isProduction),
      __PACKAGE_NAME__: JSON.stringify(pkg.name),
    },
    resolve: {
      alias: [{ find: /^react-pixi-fiber$/, replacement: fileURLToPath(new URL("src/index.ts", import.meta.url)) }],
    },
    test: {
      environment: "jsdom",
      include: ["test/**/*.test.{js,jsx,ts,tsx}"],
      setupFiles: ["vitest-webgl-canvas-mock", "./config/vitest/setupPixi.js"],
      coverage: {
        provider: "v8",
        include: ["src/**/*.{ts,tsx}"],
        reportsDirectory: `coverage/${isProduction ? "prod" : "dev"}`,
        reporter: ["json", "lcov", "text-summary"],
      },
    },
  };
});
