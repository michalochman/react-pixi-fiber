// Packs every published package the way it is published and checks which files Node and esbuild resolve.
// Run `pnpm build` first.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
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
    // The dist files set __esModule, which attw cannot see through the index.js wrapper, so it flags the adapters' default export.
    await check(`${name} attw`, () => run("pnpm", ["exec", "attw", tarball, "--ignore-rules", "false-export-default"]));

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
