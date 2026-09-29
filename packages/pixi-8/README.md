# @react-pixi-fiber/pixi-8

PixiJS 8 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 8 display objects for the core tags, which props it types, and how to create and initialize a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 8 and a React adapter from the [adapter table](https://github.com/michalochman/react-pixi-fiber/tree/master/packages/react-pixi-fiber#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi8 from "@react-pixi-fiber/pixi-8";

configure({ react: reactN(), pixi: pixi8() });
```

`createApplication` awaits `Application.init()`, so `Stage` renders its children and calls `onInit(app)` once the renderer is ready. The `view` option is passed to PixiJS as `canvas`.

A `usePixiTicker` callback receives the PixiJS 8 `Ticker`, not a delta: read `ticker.deltaTime`.

`DOMContainer`, `HTMLText`, `PerspectiveMesh`, `RenderContainer` and `RenderLayer` are tags of this adapter that render the PixiJS classes of the same names. Import them from this package.

`ParticleContainer` throws when it is rendered: its children are `Particle` objects, not display objects, so React cannot manage them. Use a `PIXIComponent` that owns the particles.

Importing the package also loads its types: the props of every tag follow the PixiJS 8 classes. Event handlers are the `onclick`, `onpointerdown`, … properties, and `eventMode` makes an object interactive.

## Compatibility with the 2.x props

Apps written for PixiJS 6 or 7 can keep their interaction props while they migrate:

```js
configure({ react: reactN(), pixi: pixi8({ compat: "pixi6" }) }); // or "pixi7"
```

With `compat`, the adapter translates the props before the core reads them:

| Prop | Becomes |
| --- | --- |
| `buttonMode` | `cursor: "pointer"`, or `cursor: null` when false |
| `click`, `pointerdown`, … (the event names) | `onclick`, `onpointerdown`, … |
| `interactive` | `eventMode: "static"`, or `eventMode: "none"` when false |
| `name` | `label` |

In development each translated prop warns once, naming the PixiJS 8 prop to use instead. When a translated prop and its PixiJS 8 prop are both passed (`interactive` and `eventMode`), the PixiJS 8 prop wins, with one warning naming both. A `PIXIComponent` with its own `applyProps` receives the props as written.

For TypeScript, import the compat typings once, for example in the app entry:

```ts
import "@react-pixi-fiber/pixi-8/compat/pixi6";
```
