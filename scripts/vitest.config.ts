import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const packagesDir = fileURLToPath(new URL("../packages/", import.meta.url));

export function createVitestConfig({ setupFiles = [] }: { setupFiles?: string[] } = {}) {
  // test:dev and test:prod differ only in __DEV__ (`--mode development|production`). NODE_ENV stays "test" in both:
  // with NODE_ENV=production React has no act() and its context objects differ from the public API snapshot.
  return defineConfig(({ mode }) => {
    const isProduction = mode === "production";
    return {
      // Classic React.createElement runtime, like the build. oxc infers the language from the extension.
      oxc: {
        include: /\.[jt]sx?$/,
        jsx: { runtime: "classic", pragma: "React.createElement", pragmaFrag: "React.Fragment" },
      },
      define: {
        __DEV__: JSON.stringify(!isProduction),
        // Read by src/render.ts (devtools renderer name)
        __PACKAGE_NAME__: JSON.stringify("react-pixi-fiber"),
      },
      resolve: {
        alias: [
          { find: /^react-pixi-fiber$/, replacement: `${packagesDir}react-pixi-fiber/src/index.ts` },
          { find: /^@react-pixi-fiber\/(react-1[789]|pixi-[4-8])$/, replacement: `${packagesDir}$1/src/index.ts` },
        ],
      },
      test: {
        environment: "jsdom",
        include: ["test/**/*.test.{js,jsx,ts,tsx}"],
        setupFiles: ["vitest-webgl-canvas-mock", ...setupFiles],
        coverage: {
          provider: "v8",
          include: ["src/**/*.{ts,tsx}"],
          reportsDirectory: `coverage/${isProduction ? "prod" : "dev"}`,
          reporter: ["json", "lcov", "text-summary"],
        },
      },
    };
  });
}
