---
"react-pixi-fiber": major
---

Split into a core package and per-version adapters. Call `configure({ react, pixi })` once at the app entry with a React adapter (`@react-pixi-fiber/react-17`, `react-18`, `react-19`) and a PixiJS adapter (`@react-pixi-fiber/pixi-4` to `pixi-8`). See the migration guide in the README.

### Added
- `configure({ react, pixi })`, called once in the app entry before the first render, wires a React adapter and a PixiJS adapter into the core. Without it the first render throws an error that prints the install line and the setup lines
- `@react-pixi-fiber/react-18`, the React 18 adapter, `@react-pixi-fiber/pixi-6`, the PixiJS 6 adapter, and `@react-pixi-fiber/pixi-7`, the PixiJS 7 adapter with the `HTMLText` tag and a `@react-pixi-fiber/pixi-7/compat/pixi6` module whose default export, passed as `pixi7({ compat })`, translates the 2.x event props (`click` to `onclick`, `pointermove` to `onglobalpointermove`, …), `buttonMode` and `interactive`, which PixiJS 7 no longer calls or reads. Without it these props warn once in development
- `@react-pixi-fiber/react-17`, the React 17 adapter, needs React 17.0.2 or a later 17.x
- `@react-pixi-fiber/react-19`, the React 19 adapter, needs React 19.3 or newer. It reports render errors on `console.error` and renders a `<ViewTransition>` inside `Stage` without animating
- Fragment refs on React 19: a `<Fragment ref>` inside `Stage` receives a `PixiFragmentInstance` with `children`, `getBounds()`, `off(event, fn)` and `on(event, fn)` over the fragment's top-level display objects
- `@react-pixi-fiber/pixi-4`, the PixiJS 4 adapter. `Mesh` and `MeshSimple` both create `PIXI.mesh.Mesh`. PixiJS 4 ships no typings; for TypeScript install `@types/pixi.js` 4, an optional peer
- `@react-pixi-fiber/pixi-5`, the PixiJS 5 adapter
- `@react-pixi-fiber/pixi-8`, the PixiJS 8 adapter with the `DOMContainer`, `HTMLText`, `Particle`, `PerspectiveMesh`, `RenderContainer` and `RenderLayer` tags and a `@react-pixi-fiber/pixi-8/compat/pixi6` module (also served as `compat/pixi7`) whose default export, passed as `pixi8({ compat })`, translates the 2.x props PixiJS 8 renamed or dropped: `mousemove`, `pointermove` and `touchmove` become `onglobalmousemove`, `onglobalpointermove` and `onglobaltouchmove`, `interactive={false}` becomes `eventMode: "passive"` as in PixiJS's own setter. Without the import the adapter holds no compat code. `ParticleContainer` takes `Particle` children on it; a Suspense boundary inside it does not hide its particles, it cannot be the container passed to `render`, and a `Particle` under any other container fails inside PixiJS
- The PixiJS adapter's `defaults` option sets default props per tag, like React's `defaultProps`: `pixi6({ defaults: { Sprite: { alpha: 0.5 } } })`. A prop that is missing or `undefined` when the instance is created gets its default before `create` runs, and a prop removed later, or set to `undefined`, returns to it. An explicit `null` is kept. Entries are keyed by the tag as written
- A PixiJS adapter can rename props with `translateProps` before they are validated, set or diffed; a `PIXIComponent` with its own `applyProps` receives the props as written
- `PIXIComponent(type, behavior)` and `PIXIProperty` replace `CustomPIXIComponent(behavior, type)` and `CustomPIXIProperty`. Behavior keys are `create`, `applyProps`, `afterAdd`, `beforeRemove`
- `PixiTickerCallback` type export, the callback type `usePixiTicker` takes
- Tags `AnimatedSprite`, `Mesh`, `MeshSimple`, `MeshPlane`, `MeshRope` and `NineSliceSprite`. Every PixiJS adapter implements all 13 tags
- `Stage` `onInit(app)` prop, called once the PixiJS application exists and the children are rendered

### Changed
- `react-reconciler` moved from the core into the React adapters; `@react-pixi-fiber/react-17` bundles `react-reconciler` 0.26.2, `@react-pixi-fiber/react-18` 0.29.2 and `@react-pixi-fiber/react-19` 0.34.0
- `pixi.js` is no longer a peer dependency of the core, the PixiJS adapter has it. The core's `react` peer is `>=17.0.0 <20.0.0`
- PixiJS 7.0–7.1 and 8.0–8.8 are not supported: `@react-pixi-fiber/pixi-7` peers `pixi.js` ^7.2.0 (`eventMode` and the `onglobal*move` handlers first ship in 7.2) and `@react-pixi-fiber/pixi-8` peers `pixi.js` ^8.9.0 (the first 8.x with every tag it exports). 2.x peered `pixi.js` >=4.4.0 <8
- A second `configure` call after a render warns once in development. Trees already rendered keep their React renderer; new PixiJS instances and prop writes use the new adapter
- The types `InteractionCompatibility`, `InteractionEventCompatibility` and `PixiTypeFallback` import from the PixiJS adapter: `@react-pixi-fiber/pixi-4`, `pixi-5` and `pixi-6` export all three, `@react-pixi-fiber/pixi-7` exports `PixiTypeFallback`
- Build output moved from `cjs/` and `es/` to `dist/cjs/` and `dist/es/`. Imports of `react-pixi-fiber` are unaffected; direct paths to the built files need the `dist/` prefix
- The `usePixiTicker` callback has the type `app.ticker.add` takes on the configured PixiJS version
- Examples are built with Vite instead of Create React App
- Examples run on PixiJS 7 with `@pixi/layers` instead of PixiJS 6
- `package.json` has an `exports` map. Bundlers that understand it (webpack 5, Vite) get the ES build directly, the development or production file picked by the `development` condition; Node and `require` still get the CommonJS entry points. Only `react-pixi-fiber` and `react-pixi-fiber/package.json` can be imported, deep imports into `dist/` or `src/` no longer resolve
- The `module` and `jsnext:main` fields and `index.es.js` are removed. `index.es.js` was a CommonJS wrapper around the ES build; bundlers that ignore `exports` now use `main`
- The type declarations are regular modules for the CommonJS and the ES build instead of a `declare module "react-pixi-fiber"` block. `tsconfig.json` `paths` pointing `react-pixi-fiber` at `index.d.ts` are no longer needed
- Code is formatted and linted with Biome instead of Prettier and ESLint
- The library is built with [tsdown](https://tsdown.dev) instead of Rollup 2 and Babel. The output files, exports and bundled dependencies are the same; the code targets ES2018 instead of ES5 and is minified with Oxc instead of terser, which makes the development builds about 20% and the production builds about 3% smaller
- The library tests run with [Vitest](https://vitest.dev) instead of Jest 26; `pnpm test` still runs the development and production suites. Babel and babel-plugin-rewire are gone, the tests mock modules with `vi.mock` instead
- `Stage` creates the PixiJS application asynchronously. Children mount after `Stage` commits; `ref._app.current` is `null` until `onInit` fires and warns in development when read before that
- `Stage` calls `onInit` once for every application it creates and keeps, so again after an `options` change recreates the application. An `options` change while the application is being created is applied once it exists. A failed application creation (a thrown error or a rejected promise) reaches the nearest error boundary. Unmounting `Stage` before the application exists destroys the application when it is ready and never calls `onInit`
- Destroying the application of an unmounted or recreated `Stage` keeps the WebGL context of an external `options.view` still in the document, so the next application on that canvas can draw; 2.x lost it. The development double mount under `<StrictMode>` no longer leaves the canvas blank on PixiJS 4 and 5
- On PixiJS 8, `Stage` accepts `options.canvas` like `options.view`: it renders no `<canvas>` and the application draws on the given one. When both are given, `view` wins
- `Stage` has no `defaultProps`: `ref.current.props.options` is `undefined` when `options` is omitted (it was `{}`)
- `Stage` passes typed prop names and Container prop names (for example `buttonMode`, `interactiveChildren`) to `app.stage`. 2.x compared the names in lowercase, so these props went to the `<canvas>` element
- A prop set to `undefined` is reset to the value PixiJS had before the first write, recorded per instance, instead of a value from a table. This covers every PixiJS version and custom components. For example `Text` `text` set to `undefined` goes back to the value the `PIXI.Text` was created with, not `""`
- Removing a prop restores the value the instance had before react-pixi-fiber first set it, which may be `undefined` (`mask`, `filters`), instead of setting it to `null`, so `<Sprite alpha={0.5} />` re-rendered as `<Sprite />` has `alpha` 1 again. An explicit `null` is still set as-is. A prop set to `undefined` or removed no longer warns under `<StrictMode>`; the development warning for an invalid value names the received value ("Received `-1` for prop `alpha`…") instead of "Received undefined"
- Development prop validation now runs on React 18 and 19 for components under a `<StrictMode>` placed inside `Stage` (or inside the tree passed to `render`). It never ran on React 18 or 19 before, because the library checked React 17's mode bit. A `<StrictMode>` around `<Stage>` does not reach the PixiJS tree, which is a separate React root, as in 2.x
- A boolean or function value on a prop the library does not type is set on the instance instead of being dropped (`<Container sortableChildren />` works). Unknown prop names are no longer reported in development; they are set as-is, as `@pixi/react` does
- `applyProps(instance, oldProps, newProps)` is exported for higher-order components; `_customApplyProps`, `_customDidAttach`, `_customWillDetach` are no longer attached to display objects
- A behavior object is read with `{ ...behavior }`, so only its own properties count. A behavior that is a class instance must set `create`, `applyProps`, `afterAdd` and `beforeRemove` as own properties, methods on its prototype are not found
- `Graphics` passes `props.geometry` to the `PIXI.Graphics` constructor
- `unmount(container)` releases the container's root, so an unmounted `Stage` no longer keeps its destroyed `app.stage` and React root alive. A second `unmount` of the same container throws `ReactPixiFiber did not render into container provided`, as for a container never rendered into; 2.x kept every root
- `afterAdd` (2.x `customDidAttach`) runs only when a child joins a parent. A keyed reorder within the same parent moves the child without calling `afterAdd` or `beforeRemove`; 2.x called `customDidAttach` again when `appendChild` moved a child, which added a listener subscribed there a second time
- `AppContext` is typed `Context<Application | null>`, its default value is `null`. `withApp` accepts any component with an `app` prop, `PixiAppProperties` is still exported for that prop. The `displayName` of a `withApp` component is `withApp(Name)` instead of the source of the wrapped function
- The source is TypeScript; the types ship from the build instead of a handwritten `index.d.ts`. `CustomDisplayObject*` and `CustomPIXIComponent*` types are renamed without the `Custom` prefix

### Deprecated
Each deprecated item keeps working in 3.x and is removed in 4.0.0. The deprecated functions, behavior keys, tag and `Stage` props warn once in development; the deprecated types, for example `InteractiveComponent` and the `Custom*` names, do not warn.
- `CustomPIXIComponent(behavior, type)` and `CustomPIXIProperty`, use `PIXIComponent(type, behavior)` and `PIXIProperty`
- Behavior keys `customDisplayObject`, `customApplyProps`, `customDidAttach` and `customWillDetach`, use `create`, `applyProps`, `afterAdd` and `beforeRemove`
- The `Custom*` type names (`CustomDisplayObject*`, `CustomPIXIComponent*`), use the names without the prefix
- `createStageClass`, it returns the function `Stage`
- Tag `NineSlicePlane`, it maps to `NineSliceSprite`
- `Stage` `width` and `height` props (deprecated since 0.12.0, the warning no longer needs `prop-types`). As in 2.x they set `app.stage.width` and `app.stage.height` and never size the renderer or reach the `<canvas>`; the renderer size comes from `options.width` and `options.height`
- The `InteractiveComponent` type in `react-pixi-fiber`, import it from `@react-pixi-fiber/pixi-4`, `pixi-5` or `pixi-6`

### Removed
- The `react-pixi-fiber/react-pixi-alias` subpath and the `react-dom` peer dependency
- UMD builds, the `prop-types` peer dependency and runtime prop-types validation, `fbjs`
- `Stage` as a class component
- The PixiJS 4 fallbacks to the `PIXI.extras`, `PIXI.mesh` and `PIXI.particles` namespaces are removed from the core; PixiJS 4 support moves to the `@react-pixi-fiber/pixi-4` adapter

### Fixed
- `cancelTimeout` cancels the timeout: `scheduleTimeout` returns its handle
- `useId` returns ids without the `undefined` prefix (`:r0:` instead of `:undefinedr0:`), the root's `identifierPrefix` is `""`
- Errors React recovers from are logged with `console.error`; 2.x passed no `onRecoverableError` handler
