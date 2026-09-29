# 0005. Check Each Package as a Consumer Installs It

**Status:** accepted
**Date:** 2026-09-26

## Context

The tests of the workspace import the source of each package through aliases (see [0004](0004-test-each-package-with-its-own-react-and-pixijs.md)). The examples app links the local packages (see [0001](0001-use-a-pnpm-workspace-monorepo.md)). Neither of them loads a package the way a consumer loads it: from a tarball, through the `exports` map, with only the declared peer dependencies installed. A package can pass every test and still fail for a consumer. Examples of such failures:

- a file that is missing from the `files` list
- an `exports` condition that points at the wrong build
- a named export that Node ESM cannot see
- declarations that resolve to `any`

## Decision Drivers

- Each published package must work for a consumer before it is published, not after a consumer reports a problem
- The check must use the same tarball that `pnpm publish` uploads
- The check must see only what a consumer installs: the package and its declared peer dependencies
- The check must cover Node `require`, Node `import`, a bundler, and the TypeScript types
- CI must run the check on every change

## Decision

`scripts/check-package.mjs` (`pnpm check-package`) checks every package that is not private. It runs after `pnpm build`. CI runs it on every change, and `pnpm release` runs it before `changeset publish`.

For each package, the script:

1. Packs the package with `pnpm pack`, so it uses the tarball that a publish would upload.
2. Runs `publint --strict` and `@arethetypeswrong/cli` on the tarball.
3. Extracts the tarball into a temporary directory and links only the declared peer dependencies next to it.
4. Checks that Node `require` and Node `import` resolve to the documented entry, and that deep imports into `dist/` do not resolve.
5. Checks that each subpath in the `exports` map resolves, for example a compat module.
6. Checks that the default export of an adapter is a callable factory from Node ESM and from Node CommonJS.
7. Checks that every named export of the ES build is also a named export from Node ESM.
8. Compiles a TypeScript consumer file under `node16` module resolution with `preserveSymlinks`. `@ts-expect-error` lines fail the compile when a type collapses to `any`.
9. Bundles the package with esbuild for ES and CommonJS, in development and production, and compares the files in the bundle with the expected build files.
10. Checks that the build of an adapter does not import the core at run time.
11. Checks that the package has no UMD build and no `prop-types` peer, and that no main entry contains compat code.

The script prints one line for each check and exits with an error when one check fails.

## Considered Alternatives

### publint and attw only

These two tools find most packaging mistakes in `package.json` and in the declarations. But they do not run the code. They do not find a missing named export in the CommonJS entry or a bundle that contains the wrong build. They also do not find types that resolve to `any` because a peer dependency is missing.

### Check the built `dist/` files in the workspace

This check is faster and needs no tarball. But the workspace has every dependency installed and has no `files` filter. A file that is missing from the tarball, or a dependency that is not declared, still works there.

### Publish to a local registry and install from it

A local npm registry (for example Verdaccio) gives a real install with real peer resolution. But it needs a registry process in CI and a second publish flow. The tarball with linked peers gives the same result for these checks with less setup.

## Consequences

- A packaging mistake fails CI before a release, but the script is custom code that the project must maintain. Each new kind of export needs a new check.
- The check sees only the declared peers, but it links them from the workspace instead of a real install. A peer range that no installed version satisfies is not found.
- esbuild stands in for all bundlers, but a problem that only webpack, Vite, or another bundler has is not found
- The check needs a build first, so it adds to the time of each CI run
