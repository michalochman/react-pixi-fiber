# 0016. Ship PixiJS Compat as Opt-In Subpaths

**Status:** accepted
**Date:** 2026-09-29

## Context

A new PixiJS major sometimes renames or removes a settable prop, or changes which handler props it calls. An application that moves to a newer PixiJS adapter then has JSX with the old prop names. Some old props fail silently. The core sets a prop that its table does not list on the instance as it is. So the core sets an old event handler prop, but PixiJS never calls it. Rewriting every use before the upgrade is a large change for a big codebase or a shared library. Most PixiJS majors rename no settable prop at all, so only some upgrades need help.

This ADR covers the props of an older PixiJS version. The deprecated API of react-pixi-fiber itself is a different concern (see [0008](0008-keep-deprecated-apis-until-the-next-major.md)).

## Decision Drivers

- An application must be able to upgrade PixiJS first and rename its props later
- An application that does not need translation must not pay for it, in bundle size or in time per prop
- The translation and the types of the old props must come from one place, so they cannot drift apart
- A translation must not change the meaning of a prop
- Importing a module must have no side effects (see [0010](0010-split-the-library-into-a-core-and-adapters.md))

## Decision

A PixiJS adapter can ship compat modules. Each compat module is a subpath of the adapter, named after the PixiJS major whose prop names it accepts, for example `@react-pixi-fiber/pixi-8/compat/pixi6`. Its default export is a `translateProps` function. The consumer passes the function to the adapter factory:

```js
import compat from "@react-pixi-fiber/pixi-8/compat/pixi6";

configure({ react: react18(), pixi: pixi8({ compat }) });
```

The core calls `translateProps` once at the entry of the prop pipeline, before validation, the first prop write, and the diff. Everything after that sees only native prop names. `Stage` translates its props before it splits them between the canvas and `app.stage`.

A compat module follows these rules:

- **Only real breakage gets a module.** A PixiJS major that renames no settable prop gets no module. When the prop names of several older majors are the same, one module covers them. An extra subpath can alias the same files under another major name.
- **Only prop-to-prop renames.** A table maps an old prop to a new prop. A table can also map a value. The value mapping must cover every value and must do the same as the deprecated setter of PixiJS itself. A prop that became a method, or that moved into a structure, stays out of the table. The README documents it.
- **The native prop wins.** A consumer can pass an old prop and its native replacement together. The native prop then wins, with one development warning that names both.
- **One warning for each translated name.** In development, each translated prop name prints one warning that names the replacement.
- **Types with the translator.** The declarations of the module add the old props to the prop types of the core. So the import of the translator also types the old props.

Some PixiJS majors dropped old handler props. Without a compat module, the adapter for such a major warns once in development for each old prop name. The warning names the compat module.

Packaging:

- The main entry of an adapter does not import, export, or bundle any compat module. Each compat module has its own entry in the build and in the `exports` map, with the same conditions as the main entry.
- The package check fails when a main production bundle contains compat code (see [0005](0005-check-each-package-as-a-consumer-installs-it.md)).
- The adapter factory throws when `compat` is not a function, with a message that names the subpath.

## Considered Alternatives

### Always translate the old props in the adapter

Applications would need no setup. But every application would pay for the translation in bundle size and in time on every prop. An application that sets an old name on purpose, for a consumer component, would get its prop renamed.

### A compat mode for every older PixiJS major on every adapter

Each adapter would accept compat for each earlier major, built from a rename list for each step. But most steps rename no settable prop, so most modes would be empty. Each empty mode would still need a subpath, types, and tests.

### A string option with a dynamic import

`pixi8({ compat: "pixi6" })` would load the module on demand. But instance creation is synchronous, so the module would not be ready at the first render. A string also cannot carry the types of the old props.

### Register compat as a side effect of an import

`import "@react-pixi-fiber/pixi-8/compat/pixi6"` would install the translator. But this is an import-time side effect, and bundlers can drop a module without exports when the package declares `sideEffects: false`.

## Consequences

- An application can upgrade PixiJS first and rename props one at a time. But it must add one import and one option while it uses old props.
- Applications that do not use compat pay nothing, but each compat module is a separate entry to build, check, and document
- The translator and the old prop types come from one import. But a prop that PixiJS turned into a method or a structure has no translation, and the consumer must rewrite it.
- Only real breakage gets a module, so modules stay few. But a consumer on an older major must find the module that covers its prop names. The README of each adapter lists them.
- Compat covers only props that go through the reconciler. Imperative code is out of reach, for example the body of a `PIXIComponent` or calls on `app.renderer`.
