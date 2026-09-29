import { esmExternalRequirePlugin } from "rolldown/plugins";
import { defineConfig, type TsdownHooks, type UserConfig } from "tsdown";

export interface PackageBuild {
  // Output basename: dist/<format>/<name>.<development|production.min>.js, declarations <name>.d.mts and <name>.d.ts
  name: string;
  // Peer dependencies, left as imports
  external: string[];
  // Dependencies to inline, for example [/^react-reconciler/]
  bundle?: RegExp[];
  hooks?: Partial<TsdownHooks>;
}

export function createTsdownConfig({ name, external, bundle = [], hooks }: PackageBuild) {
  const isProduction = process.env.NODE_ENV === "production";
  const suffix = isProduction ? "production.min" : "development";
  // One build per format, so every output lands in dist/<format>/.
  return defineConfig(
    (["es", "cjs"] as const).map(
      (format): UserConfig => ({
        entry: { [name]: "src/index.ts" },
        format,
        outDir: `dist/${format}`,
        // build:prod and build:dev write into the same directories
        clean: false,
        // Declarations next to the ES and CJS development output: publint wants .d.mts for the import condition,
        // attw wants the .d.ts that `typings` points at.
        dts: !isProduction,
        hash: false,
        platform: "browser",
        target: "es2018",
        // The source uses the classic React.createElement runtime.
        inputOptions: { transform: { jsx: "react" } },
        deps: { alwaysBundle: bundle, onlyBundle: false },
        // Marks the modules external and turns require() calls into imports; rolldown would otherwise keep
        // require("react") inside react-reconciler's development build, which breaks in browsers.
        plugins: [esmExternalRequirePlugin({ external })],
        hooks,
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
          // Read by src/render.ts (devtools renderer name)
          __PACKAGE_NAME__: JSON.stringify("react-pixi-fiber"),
          "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
        },
        minify: isProduction,
        sourcemap: isProduction,
      })
    )
  );
}
