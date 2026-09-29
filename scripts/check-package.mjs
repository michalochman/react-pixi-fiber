// Packs react-pixi-fiber the way it is published and checks which files Node and esbuild resolve.
// Run `pnpm build` first.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageDir = join(root, "packages/react-pixi-fiber");
const work = realpathSync(mkdtempSync(join(tmpdir(), "react-pixi-fiber-")));
const installed = join(work, "node_modules/react-pixi-fiber");
// The builds import only peer dependencies, so nothing else has to be installed.
const peers = ["pixi.js", "react"];

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

const entries = {
  esm: 'import * as Fiber from "react-pixi-fiber";\nconsole.log(Fiber);\n',
  cjs: 'console.log(require("react-pixi-fiber"));\n',
};

const files = {
  esDevelopment: ["dist/es/react-pixi-fiber.development.js"],
  esProduction: ["dist/es/react-pixi-fiber.production.min.js"],
  cjsDevelopment: ["dist/cjs/react-pixi-fiber.development.js", "index.js"],
  cjsProduction: ["dist/cjs/react-pixi-fiber.production.min.js", "index.js"],
};

// Files of the installed package that went into a bundle, relative to the package root.
const packageFiles = paths =>
  paths
    .map(path => relative(installed, path))
    .filter(path => !path.startsWith("..") && path.endsWith(".js"))
    .sort();

const bundleWithEsbuild = async (entry, { conditions = [], nodeEnv }) => {
  const result = await esbuild.build({
    absWorkingDir: work,
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
  return packageFiles(Object.keys(result.metafile.inputs).map(path => join(work, path)));
};

try {
  const tarball = run("pnpm", ["pack", "--pack-destination", work], packageDir).split("\n").pop();

  await check("publint", () => run("pnpm", ["exec", "publint", "--strict", tarball]));
  await check("attw", () => run("pnpm", ["exec", "attw", tarball]));

  mkdirSync(installed, { recursive: true });
  run("tar", ["-xzf", tarball, "-C", installed, "--strip-components=1"]);
  for (const [name, source] of Object.entries(entries)) writeFileSync(join(work, `${name}.js`), source);

  const require = createRequire(join(work, "index.js"));
  await check("node require", () => {
    assert.equal(require.resolve("react-pixi-fiber"), join(installed, "index.js"));
  });
  await check("node import", () => {
    const resolve = specifier =>
      run(
        "node",
        ["--input-type=module", "-e", `console.log(import.meta.resolve(${JSON.stringify(specifier)}))`],
        work
      );
    assert.equal(fileURLToPath(resolve("react-pixi-fiber")), join(installed, "index.js"));
  });
  await check("deep imports are not exported", () => {
    assert.throws(() => require.resolve("react-pixi-fiber/dist/cjs/react-pixi-fiber.development.js"), {
      code: "ERR_PACKAGE_PATH_NOT_EXPORTED",
    });
  });

  await check("esbuild import", async () =>
    assert.deepEqual(await bundleWithEsbuild("esm", { nodeEnv: "production" }), files.esProduction)
  );
  await check("esbuild import, development condition", async () =>
    assert.deepEqual(
      await bundleWithEsbuild("esm", { conditions: ["development"], nodeEnv: "development" }),
      files.esDevelopment
    )
  );
  await check("esbuild require, production", async () =>
    assert.deepEqual(await bundleWithEsbuild("cjs", { nodeEnv: "production" }), files.cjsProduction)
  );
  await check("esbuild require, development", async () =>
    assert.deepEqual(await bundleWithEsbuild("cjs", { nodeEnv: "development" }), files.cjsDevelopment)
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
