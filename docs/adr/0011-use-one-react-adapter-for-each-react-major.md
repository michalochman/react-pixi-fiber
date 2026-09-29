# 0011. Use One React Adapter for Each React Major

**Status:** accepted
**Date:** 2026-09-26

## Context

A custom React renderer uses `react-reconciler`. The reconciler talks to the `react` package of the application through internal objects of React, for example the hooks dispatcher. So a reconciler works only with the `react` versions that it was released with, and it declares these versions as its `react` peer range. The host config that a renderer gives to the reconciler also changes between React majors. Each major adds, removes, and renames keys. The root and DevTools functions also take different arguments. Inside one React major, the host config changes less. But a newer React minor can need a newer reconciler, sometimes with new host config keys.

The core does not import `react-reconciler` (see [0010](0010-split-the-library-into-a-core-and-adapters.md)).

## Decision Drivers

- Each React major must get a reconciler that matches it, with no version matching by the consumer
- Code for one React major must not change when support for another major is added
- The core must stay the same for every React major
- A consumer must get an install error or warning, not a run-time failure, when the React version does not match
- `render` must commit synchronously on every React major, as in earlier versions of the library

## Decision

Each supported React major has one adapter package, `@react-pixi-fiber/react-<major>`.

Each adapter:

- bundles the newest `react-reconciler` release of its React major. The reconciler is not a dependency of the adapter, so consumers never install it.
- declares a `react` peer range that is exactly the `react` peer range of the bundled reconciler
- builds the host config for its reconciler from the version-independent host operations that the core gives it (`hostOps`). The host config maps the reconciler keys onto these operations and makes the other keys no-ops.
- owns root creation, the root registry, and DevTools injection
- exports its React StrictMode fiber bit as a constant, so the core can find a `<StrictMode>` ancestor
- is a factory that returns `createRenderer(hostOps, { isPrimaryRenderer })` and the constants

`configure` calls `createRenderer` twice, for the primary and the secondary renderer.

When a new React minor needs a newer reconciler, the adapter releases a new major that bundles the newer reconciler and raises its `react` floor. Applications on older React minors stay on the previous adapter major. That major gets patch releases only when necessary.

## Considered Alternatives

### One adapter for each React minor

Each adapter would match one React minor exactly. But most React minors need no new reconciler. The number of packages would grow with every React minor, and consumers would have to change the package name on each React upgrade.

### The consumer installs `react-reconciler`

The adapter would declare `react-reconciler` as a peer dependency, so consumers could select any reconciler version. But consumers would then have to match the reconciler to their React version themselves. react-dom avoids this: it ships its reconciler with each React release.

### One package for all React majors

One package would contain the host configs for all majors and select one from `React.version`. But every application would ship the reconcilers of all majors. A change for one major would also release a new version for all majors.

## Consequences

- Consumers install one adapter and never match a reconciler version, but the adapter peer range can be narrower than the React major. An application on an older React minor must upgrade React or use an older adapter major, when one exists.
- A reconciler update that raises the React floor is a breaking change, so it needs a new adapter major
- The adapters for different React majors share no runtime code, so a change to one never breaks another. But the adapters contain similar host config code, and a contributor must copy a fix to that code into each adapter by hand.
- The core stays the same for all React majors, but the `hostOps` contract of the core must serve every reconciler version
