# 0004. Test Each Package with Its Own React and PixiJS

**Status:** accepted
**Date:** 2026-09-26

## Context

Version 2.x tested one package with Jest 26 and babel-plugin-rewire. Version 3.0.0 has a core package, one React adapter for each React major, and one PixiJS adapter for each PixiJS major (see [0001](0001-use-a-pnpm-workspace-monorepo.md)). Each adapter supports a different version of React or PixiJS. A consumer can combine any React adapter with any PixiJS adapter. The library behaves differently in development and in production, because the production build does not contain the development-only warnings and checks (see [0002](0002-build-every-package-with-tsdown.md)).

## Decision Drivers

- Each package must be tested against the React or PixiJS version that it supports, not against the version that another package uses
- Tests must cover the development behavior and the production behavior
- A test of one package must not add another package as a workspace dependency. The dependency graph of the packages must stay the same as for a consumer.
- The number of test runs must not grow with the number of possible adapter pairs
- The public types are part of the API and must have tests too

## Decision

Vitest runs the tests of every package. One factory, `scripts/vitest.config.ts`, defines the configuration. Each package calls the factory in its own `vitest.config.mts`. The tests run in jsdom with `vitest-webgl-canvas-mock`.

Each package has two test scripts:

- `test:dev` runs the tests with `__DEV__` set to `true`
- `test:prod` runs the same tests with `__DEV__` set to `false`

CI runs both scripts for every package.

Each package pins its own `react` and `pixi.js` versions as devDependencies. The Vitest config aliases React to the copy of the package under test, because the React version that renders an element must also create it. The config aliases workspace packages to their sources by relative path, so no package lists another package as a test dependency.

The tests of each package have these scopes:

- **Core:** the full behavior suite runs against one real React adapter and one real PixiJS adapter, the development pair. A 2.x compatibility suite (`test/compat2x.test.jsx`) runs 2.x usage against the 3.0.0 core.
- **React adapters:** render, unmount, DevTools injection, and synchronous commit. A fake PixiJS adapter from the test utilities of the core drives these tests. The fake uses plain objects, not real PixiJS.
- **PixiJS adapters:** components, property tables, application creation, and compat translation, against the real PixiJS version of the adapter. One React adapter renders the components.

One smoke suite lives in the test utilities of the core, as a function. It mounts a `Stage`, renders a `Sprite`, changes a prop, reorders children, and unmounts. Each adapter calls the smoke suite with its own `configure({ react, pixi })` pair. React adapters use the fake PixiJS adapter. PixiJS adapters use a real React adapter. The full matrix of all adapter pairs does not run.

Type tests are TSX fixtures under `test/typescript/`. `pnpm check-types` compiles them. A fixture shows that valid usage compiles and that invalid usage fails, with `@ts-expect-error`.

## Considered Alternatives

### Jest, as in 2.x

The 2.x suite already ran on Jest. But Jest needs Babel or a separate transform for TypeScript. babel-plugin-rewire, which the 2.x tests used to replace module internals, depends on Babel. Vitest uses the same transform as the build tooling and runs TypeScript directly.

### Run the full matrix of adapter pairs

Each React adapter would run with each PixiJS adapter. This finds a problem that only one pair has. But the number of runs grows as the product of the React majors and the PixiJS majors. The adapters meet only through the data contract of the core, so a pair-specific problem is unlikely. The smoke suite tests each adapter with one real partner.

### A browser test runner instead of jsdom

A real browser runs real WebGL, and the PixiJS application code runs as in production. But browser runs are slower and need a browser in CI. jsdom with a canvas mock covers the logic of the library. The examples app covers real rendering, and contributors check it manually in a browser.

## Consequences

- Each package tests the versions that it supports, but the workspace installs several React and PixiJS majors side by side. Each package needs the Vitest alias to find its own copy.
- Development and production behavior both have tests, but each test run takes twice as long
- The smoke suite and the fake PixiJS adapter keep the adapter tests small. But a release can contain a problem that only one adapter pair has.
- Tests run in jsdom with a canvas mock, so they are fast, but no automated test checks real WebGL rendering. A rendering change needs a manual browser check of the examples.
- Adapters import shared test utilities from the core by relative path, so a change to these utilities can break the tests of every adapter
