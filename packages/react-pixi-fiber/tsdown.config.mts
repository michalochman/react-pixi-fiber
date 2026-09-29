import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { esmExternalRequirePlugin } from "rolldown/plugins";
import { defineConfig, type TsdownHooks } from "tsdown";
import pkg from "./package.json" with { type: "json" };

const isProduction = process.env.NODE_ENV === "production";
const suffix = isProduction ? "production.min" : "development";

const peers = ["react", "pixi.js", "react-pixi-fiber"];

const entries = {
  "react-pixi-fiber": { input: "src/index.ts", external: peers },
};
const formats = ["es", "cjs"] as const;

// src/index.ts exports `Stage` as a value and a type (a local type alias next to the imported value).
// rolldown-plugin-dts 0.27 keeps the type and drops the value from the bundled declarations, so this hook
// declares the value in the declaration files each build wrote (a Rolldown plugin misses the CJS ones).
// It does nothing once the bundler keeps the value, for example when `Stage` becomes a local declaration
// that is both a value and a type (the bundler keeps those, like the tag constants).
const declareStageValue: TsdownHooks["build:done"] = ({ chunks }) => {
  for (const chunk of chunks) {
    if (!/\.d\.m?ts$/.test(chunk.fileName)) continue;
    const path = join(chunk.outDir, chunk.fileName);
    const code = readFileSync(path, "utf8");
    if (/\bdeclare (?:const|let|function|class) Stage\b|\b\w+ as Stage\b/.test(code)) continue;
    if (!/\btype Stage = StageComponent;/.test(code)) {
      throw new Error(`${path}: found neither a \`Stage\` value nor its type, see declareStageValue`);
    }
    writeFileSync(path, `${code}\ndeclare const Stage: StageComponent;\n`);
  }
};

// One build per entry and format, so every output lands in dist/<format>/<entry>.<development|production.min>.js.
export default defineConfig(
  Object.entries(entries).flatMap(([name, { input, external }]) =>
    formats.map(format => ({
      entry: { [name]: input },
      format,
      outDir: `dist/${format}`,
      // build:prod and build:dev write into the same directories
      clean: false,
      // Declarations next to the ES and CJS development output: publint wants .d.mts for the import condition.
      dts: !isProduction,
      hash: false,
      platform: "browser",
      target: "es2018",
      // The source uses the classic React.createElement runtime.
      inputOptions: { transform: { jsx: "react" } },
      // Peers stay external; dependencies are bundled like the Rollup build did.
      deps: { alwaysBundle: [/^react-reconciler/], onlyBundle: false },
      // The plugin marks the modules external and turns require() calls into imports. Rolldown would
      // otherwise keep the require("react") inside react-reconciler's development build, which
      // breaks in browsers.
      plugins: [esmExternalRequirePlugin({ external })],
      hooks: { "build:done": declareStageValue },
      outputOptions: {
        // Fixed names instead of tsdown's defaults. Declaration chunks are named `<entry>.d`.
        entryFileNames: chunk =>
          chunk.name.endsWith(".d") ? (format === "es" ? "[name].mts" : "[name].ts") : `[name].${suffix}.js`,
        exports: "named",
        // Rollup always added the __esModule marker, rolldown only does with a default export.
        esModule: true,
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
