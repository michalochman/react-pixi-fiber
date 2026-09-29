# 0010. Split the Library into a Core and Adapters

**Status:** accepted
**Date:** 2026-09-26

## Context

Version 2.x worked with one React major and one PixiJS major at a time. Its reconciler setup was for one `react-reconciler` version, and its built-in components called the API of one PixiJS version. React and PixiJS both change their APIs between majors. Applications upgrade React and PixiJS at different times. Applications on different React and PixiJS versions use the same shared component libraries, so these libraries must not depend on one version of either.

Only one PixiJS version runs in an application at a time. Server-side rendering is not a goal.

## Decision Drivers

- The library must work with each supported React major and each supported PixiJS major, in any combination
- React majors before 17 are out of scope. Earlier majors of react-pixi-fiber support React 16, and the original `react-pixi` package supports React 15.
- Code that uses only components, hooks, and props must run unchanged on any combination
- A shared component library must depend on the library without choosing a React or PixiJS version
- Adding support for a new React or PixiJS major must not change the code of the other majors
- Importing the library must have no side effects, so that tests and tools can import it freely

## Decision

The library splits into a core package and two kinds of adapter packages:

- The **core** (`react-pixi-fiber`) holds everything that does not depend on a React or PixiJS version. Examples are the tags, `PIXIComponent`, `Stage`, the hooks, the prop pipeline, and `configure`. The core imports neither `react-reconciler` nor `pixi.js`.
- A **React adapter** creates the reconciler for one React major (see [0011](0011-use-one-react-adapter-for-each-react-major.md)).
- A **PixiJS adapter** describes one PixiJS major as data: components, property tables, and application functions (see [0012](0012-describe-each-pixijs-major-as-adapter-data.md)).

An application connects one React adapter and one PixiJS adapter to the core once, at its entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react19 from "@react-pixi-fiber/react-19";
import pixi8 from "@react-pixi-fiber/pixi-8";

configure({ react: react19(), pixi: pixi8() });
```

All other code imports only from the core:

```js
import { Stage, Container, Sprite, usePixiApp } from "react-pixi-fiber";
```

`configure` has these rules:

- It is synchronous and sets a module-level configuration. The last call wins.
- Each adapter is a factory. The application calls the factory and passes the result. The factory takes options, so a new option does not change the call shape.
- It checks its arguments. An adapter factory that the application passed without a call fails with a message that shows the expected call.
- A call after a render warns once in development. Containers that already rendered keep the renderer that rendered them. New renders use the new configuration.
- Importing the core creates no reconciler. The first render or the first `Stage` mount without a `configure` call fails. The message prints the install command and the setup lines.

The name `configure` is intentional. `init` suggests a one-time asynchronous step, `setup` says nothing specific, and `extend` means "add components" in @pixi/react and react-three-fiber.

## Considered Alternatives

### One package for each React and PixiJS combination

Each combination would be a complete package with no configuration step. But the number of packages grows as the product of the React majors and the PixiJS majors. A shared component library would have to choose one combination.

### One major of react-pixi-fiber for each PixiJS major

Each major of the library would follow one PixiJS major, as @pixi/react follows PixiJS 8. This is simple for applications on the newest PixiJS. But applications on older PixiJS versions get no new releases, and a shared component library must choose a major.

### Detect React and PixiJS at run time

The library would read the React and PixiJS versions at run time and select the matching code. Applications would need no setup. But the package would have to contain the code for every React and PixiJS major, so bundles would contain code that never runs.

### A React context provider instead of a module-level configuration

Each tree would get its adapters from a provider component. But the reconciler exists before any React tree renders, and host operations run outside React context. A provider cannot supply the reconciler that renders it.

## Consequences

- Shared code runs on any supported combination, but every application adds three setup lines at its entry
- Support for a new major is a new adapter package, but the adapter contract of the core must stay stable across all adapters
- The configuration is module-level, so it is simple and fast, but an application cannot select different adapters for different trees
- Import has no side effects, but a missing `configure` call fails only at the first render, not at import. Tests must call `configure` in their setup.
- A second `configure` call after a render keeps working, which helps hot reload. But trees from before and after the call can run on different renderers until they unmount.
