# @react-pixi-fiber/pixi-8

PixiJS 8 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 8 display objects for all 13 core tags, which props it types, and how to create and initialize a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 8 and a React adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi8 from "@react-pixi-fiber/pixi-8";

configure({ react: reactN(), pixi: pixi8() });
```

`createApplication` awaits `Application.init()`, so `Stage` renders its children and calls `onInit(app)` once the renderer is ready. The `view` option is passed to PixiJS as `canvas`.

A `usePixiTicker` callback receives the PixiJS 8 `Ticker`, not a delta: read `ticker.deltaTime`.

`DOMContainer`, `HTMLText`, `Particle`, `PerspectiveMesh`, `RenderContainer` and `RenderLayer` are tags of this adapter that render the PixiJS classes of the same names. Import them from this package.

`ParticleContainer` takes `<Particle>` children, not display objects:

```jsx
import { ParticleContainer } from "react-pixi-fiber";
import { Particle } from "@react-pixi-fiber/pixi-8";

<ParticleContainer dynamicProperties={{ position: true }} texture={texture}>
  {bunnies.map(bunny => (
    <Particle key={bunny.id} texture={texture} x={bunny.x} y={bunny.y} />
  ))}
</ParticleContainer>;
```

A `Particle` needs a `texture` and takes the `Particle` fields as props (`x`, `y`, `scaleX`, `scaleY`, `anchorX`, `anchorY`, `rotation`, `tint`, `alpha`). PixiJS uploads only the `dynamicProperties` every frame, so a change to any other prop of a `Particle` calls the container's `update()`, which uploads every particle again. `ParticleContainer` takes `dynamicProperties`, `roundPixels`, `shader` and `texture`, read when it is created; `ParticleContainerProps` types them. Limitations: a Suspense boundary inside a `ParticleContainer` does not hide its particles while it shows a fallback (a boundary above the container hides the container), a `ParticleContainer` cannot be the container passed to `render`, and a `<Particle>` under any other container fails inside PixiJS.

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
