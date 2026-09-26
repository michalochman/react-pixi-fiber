import { esmExternalRequirePlugin } from "rolldown/plugins";
import { defineConfig } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const isProduction = process.env.NODE_ENV === "production";
const suffix = isProduction ? "production.min" : "development";

const peers = ["react", "react-dom", "prop-types", "pixi.js", "react-pixi-fiber"];

const entries = {
  "react-pixi-fiber": { input: "src/index.js", external: peers },
  "react-pixi-alias": { input: "src/react-pixi-alias/index.js", external: [...peers, "react-pixi-fiber"] },
};
const formats = ["es", "cjs", "umd"] as const;

// One build per entry and format, so the alias entry can treat react-pixi-fiber as external and
// every output lands in dist/<format>/<entry>.<development|production.min>.js.
export default defineConfig(
  Object.entries(entries).flatMap(([name, { input, external }]) =>
    formats.map(format => ({
      entry: { [name]: input },
      format,
      outDir: `dist/${format}`,
      // build:prod and build:dev write into the same directories
      clean: false,
      dts: false,
      hash: false,
      platform: "browser",
      target: "es2018",
      // The source has JSX in .js files and uses the classic React.createElement runtime.
      loader: { ".js": "jsx" },
      inputOptions: { transform: { jsx: "react" } },
      // Peers stay external; dependencies are bundled like the Rollup build did.
      deps: { alwaysBundle: [/^react-reconciler/, /^fbjs/], onlyBundle: false },
      // The plugin marks the modules external and turns require() calls into imports. Rolldown would
      // otherwise keep the require("react") inside react-reconciler's development build, which
      // breaks in browsers.
      plugins: [esmExternalRequirePlugin({ external })],
      globalName: "ReactPixiFiber",
      outputOptions: {
        // tsdown would otherwise add a .umd infix
        entryFileNames: `[name].${suffix}.js`,
        // react-pixi-alias has a default export next to the named ones
        exports: "named",
        // Rollup always added the __esModule marker, rolldown only does with a default export.
        esModule: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "prop-types": "PropTypes",
          "pixi.js": "PIXI",
          "react-pixi-fiber": "ReactPixiFiber",
        },
      },
      define: {
        __DEV__: JSON.stringify(!isProduction),
        __PACKAGE_NAME__: JSON.stringify(pkg.name),
        "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
      },
      minify: isProduction,
      sourcemap: isProduction,
    }))
  )
);
