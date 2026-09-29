# 0002. Build Every Package with tsdown

**Status:** accepted
**Date:** 2026-09-26

## Context

Version 2.x built one JavaScript package with Rollup 2 and Babel. The package had CommonJS, ES, and UMD builds, and no `exports` map, so consumers could import any built file directly. Version 3.0.0 publishes a core package and many adapter packages (see [0001](0001-use-a-pnpm-workspace-monorepo.md)). Every package must build the same way. Consumers load the packages in three ways. Bundlers import the ES build. Node `require` loads the CommonJS build. Node ESM imports the CommonJS build through its default export. The library prints development warnings that must not ship in production code.

## Decision Drivers

- One build definition for all packages, so that a change to the build applies to all packages
- A development build and a production build for each package, with development-only code removed from the production build
- Correct entry points and correct type declarations for ES and CommonJS consumers
- Type declarations that come from the source, not declarations that a person writes and maintains by hand
- The React adapters must contain their `react-reconciler` version, because the consumer does not install it

## Decision

The source of every package is TypeScript (TypeScript 7). tsdown builds every package. One factory, `scripts/tsdown.config.ts`, defines the build. The `tsdown.config.mts` of each package calls the factory with a few options:

- the output name
- extra entry points
- the peer dependencies, which stay external
- the dependencies to bundle
- optional build hooks

Each package build writes:

- `dist/es/<name>.development.js` and `dist/es/<name>.production.min.js`, with declarations in `dist/es/<name>.d.mts`
- `dist/cjs/<name>.development.js` and `dist/cjs/<name>.production.min.js`, with declarations in `dist/cjs/<name>.d.ts`
- a source map for each production file

The build replaces `__DEV__` and `process.env.NODE_ENV` with constants. tsdown minifies the production build. The output target is ES2018. Peer dependencies stay as imports. The React adapters bundle their `react-reconciler`.

The `exports` map of each package is the only public entry:

- The `import` condition resolves to the ES build. The `development` condition selects the development file. Otherwise the production file resolves.
- The `node` and `require` conditions resolve to a root `index.js`. This file loads the development or production CommonJS build from `process.env.NODE_ENV`.
- Deep imports into `dist/` do not resolve.

The `index.js` of an adapter sets `module.exports` to the adapter factory, and lists each named export on a separate line. Node ESM then default-imports the factory. The CommonJS declarations of an adapter use `export =` to match.

Version 3.0.0 has no UMD builds and no `prop-types` validation.

## Considered Alternatives

### Rollup and Babel, as in 2.x

This build worked in 2.x. But TypeScript source needs one more plugin in the chain. Each package would need its own Rollup config with the same plugins. The declarations need a separate tool. tsdown does the transform, the bundle, and the declarations in one tool.

### The TypeScript compiler alone, with no bundler

`tsc` is the smallest toolchain. But it cannot remove development-only code, bundle `react-reconciler`, or minify. Consumers would get one build with the warnings in it.

### ES modules only

One format halves the build output and removes the `index.js` files and the `export =` declarations. But `require` consumers, and test runners that load CommonJS, would stop working. Version 2.x supported them.

### Keep UMD builds and `prop-types` validation, as in 2.x

UMD builds let a page load the library with a `<script>` tag and no bundler. `prop-types` checks prop values at run time for JavaScript users. But both serve a small group of users, and React 19 removed both: it has no UMD builds and it ignores `propTypes`. Each adapter would also need its own UMD global, and the page would have to load the scripts in dependency order.

## Consequences

- One factory keeps all package builds the same, but a package with a special need must use a factory option or a build hook
- tsdown and rolldown are young, and their declaration bundler has gaps. Two build hooks change the output: one declares the `Stage` value in the core, and one writes `export =` for the adapters. A tsdown update can make a hook unnecessary, or it can break a hook.
- Consumers get the development or the production build without configuration, but each package ships four JavaScript files. The tests must run against both builds (see [0004](0004-test-each-package-with-its-own-react-and-pixijs.md)).
- ES and CommonJS consumers both work, but the `index.js` of each adapter lists its named exports by hand. Node ESM cannot see a new export that is missing from that list. The package check in [0005](0005-check-each-package-as-a-consumer-installs-it.md) finds this omission.
- The ES2018 target makes the output smaller than an ES5 target, but a consumer that needs ES5 must transpile the package
