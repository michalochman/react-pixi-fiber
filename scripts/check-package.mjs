// Packs every published package the way it is published and checks which files Node and esbuild resolve.
// Run `pnpm build` first.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = fileURLToPath(new URL("..", import.meta.url));
const packagesDir = join(root, "packages");
const packages = readdirSync(packagesDir)
  .map(dir => ({
    dir: join(packagesDir, dir),
    pkg: JSON.parse(readFileSync(join(packagesDir, dir, "package.json"), "utf8")),
  }))
  .filter(({ pkg }) => !pkg.private);
const work = realpathSync(mkdtempSync(join(tmpdir(), "react-pixi-fiber-")));

const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, encoding: "utf8" }).trim();

const failures = [];
const check = async (name, fn) => {
  try {
    await fn();
    console.log(`ok    ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`FAIL  ${name}\n${error.stdout || ""}${error.message}\n`);
  }
};

try {
  for (const { dir, pkg } of packages) {
    const name = pkg.name;
    const base = name.split("/").pop();
    // The builds import only peer dependencies, so nothing else has to be installed.
    const peers = Object.keys(pkg.peerDependencies || {});
    const pkgWork = join(work, base);
    const installed = join(pkgWork, "node_modules", name);
    const entries = {
      esm: `import * as Mod from ${JSON.stringify(name)};\nconsole.log(Mod);\n`,
      cjs: `console.log(require(${JSON.stringify(name)}));\n`,
    };
    const files = {
      esDevelopment: [`dist/es/${base}.development.js`],
      esProduction: [`dist/es/${base}.production.min.js`],
      cjsDevelopment: [`dist/cjs/${base}.development.js`, "index.js"],
      cjsProduction: [`dist/cjs/${base}.production.min.js`, "index.js"],
    };

    // Files of the installed package that went into a bundle, relative to the package root.
    const packageFiles = paths =>
      paths
        .map(path => relative(installed, path))
        .filter(path => !path.startsWith("..") && path.endsWith(".js"))
        .sort();

    const bundleWithEsbuild = async (entry, { conditions = [], nodeEnv }) => {
      const result = await esbuild.build({
        absWorkingDir: pkgWork,
        entryPoints: [`./${entry}.js`],
        bundle: true,
        write: false,
        metafile: true,
        platform: "browser",
        external: peers,
        conditions,
        define: { "process.env.NODE_ENV": JSON.stringify(nodeEnv) },
        logLevel: "silent",
      });
      return packageFiles(Object.keys(result.metafile.inputs).map(path => join(pkgWork, path)));
    };

    mkdirSync(installed, { recursive: true });
    const tarball = run("pnpm", ["pack", "--pack-destination", pkgWork], dir).split("\n").pop();

    await check(`${name} publint`, () => run("pnpm", ["exec", "publint", "--strict", tarball]));
    await check(`${name} attw`, () => run("pnpm", ["exec", "attw", tarball]));

    run("tar", ["-xzf", tarball, "-C", installed, "--strip-components=1"]);
    for (const [entry, source] of Object.entries(entries)) writeFileSync(join(pkgWork, `${entry}.js`), source);

    const require = createRequire(join(pkgWork, "index.js"));
    await check(`${name} node require`, () => {
      assert.equal(require.resolve(name), join(installed, "index.js"));
    });
    await check(`${name} node import`, () => {
      const resolve = specifier =>
        run(
          "node",
          ["--input-type=module", "-e", `console.log(import.meta.resolve(${JSON.stringify(specifier)}))`],
          pkgWork
        );
      assert.equal(fileURLToPath(resolve(name)), join(installed, "index.js"));
    });
    await check(`${name} deep imports are not exported`, () => {
      assert.throws(() => require.resolve(`${name}/dist/cjs/${base}.development.js`), {
        code: "ERR_PACKAGE_PATH_NOT_EXPORTED",
      });
    });

    // Subpaths other than the entry point, for example `@react-pixi-fiber/pixi-8/compat/pixi6`.
    const subpaths = Object.keys(pkg.exports || {})
      .filter(key => key !== "." && key !== "./package.json")
      .map(key => `${name}${key.slice(1)}`);
    for (const subpath of subpaths) {
      await check(`${subpath} node require and import`, () => {
        const file = require.resolve(subpath);
        assert.ok(file.startsWith(installed) && existsSync(file), file);
        const imported = run(
          "node",
          ["--input-type=module", "-e", `console.log(import.meta.resolve(${JSON.stringify(subpath)}))`],
          pkgWork
        );
        assert.equal(fileURLToPath(imported), file);
      });
    }
    const subpathImports = subpaths.map(subpath => `import ${JSON.stringify(subpath)};\n`).join("");

    // The default export is called at run time, so the peers have to resolve: link the ones the workspace installed.
    for (const peer of peers) {
      const source = join(dir, "node_modules", peer);
      if (!existsSync(source)) continue;
      const target = join(pkgWork, "node_modules", peer);
      mkdirSync(join(target, ".."), { recursive: true });
      symlinkSync(realpathSync(source), target);
    }
    const hasDefault = /\bas default\b|export default/.test(
      readFileSync(join(installed, `dist/es/${base}.d.mts`), "utf8")
    );
    const callable = "const callable: (...args: never[]) => unknown =";
    writeFileSync(
      join(pkgWork, "a.mts"),
      subpathImports +
        (hasDefault
          ? `import factory from ${JSON.stringify(name)};\n${callable} factory;\nconsole.log(callable);\n`
          : `import * as mod from ${JSON.stringify(name)};\nconsole.log(mod);\n`)
    );
    writeFileSync(
      join(pkgWork, "a.cts"),
      subpathImports +
        (hasDefault
          ? `import * as mod from ${JSON.stringify(name)};\n${callable} mod.default;\nconsole.log(callable);\n`
          : `import * as mod from ${JSON.stringify(name)};\nconsole.log(mod);\n`)
    );
    writeFileSync(
      join(pkgWork, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          module: "node16",
          moduleResolution: "node16",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
        },
        include: ["a.mts", "a.cts"],
      })
    );
    await check(`${name} types resolve under node16`, () =>
      run("pnpm", ["exec", "tsc", "-p", join(pkgWork, "tsconfig.json")])
    );
    if (hasDefault) {
      await check(`${name} default export is callable from node ESM`, () => {
        writeFileSync(
          join(pkgWork, "default.mjs"),
          `import factory from ${JSON.stringify(name)};\nif (typeof factory !== "function") throw new Error(typeof factory);\n`
        );
        run("node", ["default.mjs"], pkgWork);
      });
      await check(`${name} default export is callable from node CJS`, () => {
        writeFileSync(
          join(pkgWork, "default.cjs"),
          `const mod = require(${JSON.stringify(name)});\nconst factory = mod.default ?? mod;\nif (typeof factory !== "function") throw new Error(typeof factory);\n`
        );
        run("node", ["default.cjs"], pkgWork);
      });
    }
    if (name !== "react-pixi-fiber") {
      await check(`${name} build does not import the core at run time`, () => {
        for (const file of readdirSync(installed, { recursive: true }).filter(file => file.endsWith(".js"))) {
          assert.doesNotMatch(
            readFileSync(join(installed, file), "utf8"),
            /(?:\bfrom|\bimport\s*\(?|\brequire\()\s*["']react-pixi-fiber["']/,
            file
          );
        }
      });
    }
    // Node ESM reads the named exports of the CommonJS entry by static analysis, so one that the entry does not spell
    // out is missing there although the ES build has it.
    for (const [key, conditions] of Object.entries(pkg.exports || {})) {
      if (key === "./package.json") continue;
      const specifier = `${name}${key.slice(1)}`;
      await check(`${specifier} named exports from node ESM match the ES build`, () => {
        writeFileSync(
          join(pkgWork, "named.mjs"),
          `import * as node from ${JSON.stringify(specifier)};\n` +
            `const es = await import(${JSON.stringify(join(installed, conditions.import.development))});\n` +
            "const missing = Object.keys(es).filter(name => !(name in node));\n" +
            'if (missing.length > 0) throw new Error(`missing: ${missing.join(", ")}`);\n'
        );
        run("node", [...dom, "named.mjs"], pkgWork);
      });
    }

    await check(`${name} esbuild import`, async () =>
      assert.deepEqual(await bundleWithEsbuild("esm", { nodeEnv: "production" }), files.esProduction)
    );
    await check(`${name} esbuild import, development condition`, async () =>
      assert.deepEqual(
        await bundleWithEsbuild("esm", { conditions: ["development"], nodeEnv: "development" }),
        files.esDevelopment
      )
    );
    await check(`${name} esbuild require, production`, async () =>
      assert.deepEqual(await bundleWithEsbuild("cjs", { nodeEnv: "production" }), files.cjsProduction)
    );
    await check(`${name} esbuild require, development`, async () =>
      assert.deepEqual(await bundleWithEsbuild("cjs", { nodeEnv: "development" }), files.cjsDevelopment)
    );
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
