# @react-pixi-fiber/pixi-8

PixiJS 8 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 8 display objects for all 13 core tags, which props it types, and how to create and initialize a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 8 and a React adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi8 from "@react-pixi-fiber/pixi-8";

configure({ react: reactN(), pixi: pixi8() });
```

## Supported features

Features that are plain PixiJS work as the [PixiJS 8 documentation](https://pixijs.com/8.x/guides) describes.

| Tag | Creates |
| --- | --- |
| `AnimatedSprite` | `PIXI.AnimatedSprite` |
| `BitmapText` | `PIXI.BitmapText`, from `style` and `text` |
| `Container` | `PIXI.Container` |
| `DOMContainer` | `PIXI.DOMContainer`, a tag of this adapter |
| `Graphics` | `PIXI.Graphics`, `context` is passed to the constructor |
| `HTMLText` | `PIXI.HTMLText`, a tag of this adapter |
| `Mesh` | `PIXI.Mesh`, from `geometry`, `shader`, `state` and `texture` |
| `MeshPlane` | `PIXI.MeshPlane` |
| `MeshRope` | `PIXI.MeshRope` |
| `MeshSimple` | `PIXI.MeshSimple`, from `texture`, `vertices`, `uvs`, `indices` and `topology` |
| `NineSliceSprite` | `PIXI.NineSliceSprite` |
| `Particle` | `PIXI.Particle`, a tag of this adapter, only inside a `ParticleContainer` |
| `ParticleContainer` | `PIXI.ParticleContainer`, with `Particle` children |
| `PerspectiveMesh` | `PIXI.PerspectiveMesh`, a tag of this adapter |
| `RenderContainer` | `PIXI.RenderContainer`, a tag of this adapter |
| `RenderLayer` | `PIXI.RenderLayer`, a tag of this adapter, see [below](#renderlayer) |
| `Sprite` | `PIXI.Sprite` |
| `Text` | `PIXI.Text`, from `style` and `text` |
| `TilingSprite` | `PIXI.TilingSprite` |

Import the tags of this adapter from this package. `<NineSlicePlane />` is not a tag here: the core maps it to `NineSliceSprite` with a development warning.

| Feature | Support |
| --- | --- |
| Application | `Stage` creates a `PIXI.Application` and awaits `app.init(options)`, then renders its children and calls `onInit(app)`. The `view` option, by default the canvas `Stage` renders, is passed to PixiJS as `canvas` |
| `compat` option | Translates the PixiJS 6 and 7 props, see [below](#compatibility-with-the-2x-props) |
| `defaults` option | `pixi8({ defaults: { Text: { text: "" } } })` sets, per tag, the value a prop returns to when it is set to `undefined`. Without it, a prop returns to the value the instance had before the first write |
| Events | The PixiJS 8 handler properties as props: `onclick`, `onpointerdown`, …, with `eventMode` to make an object interactive |
| Ticker | A `usePixiTicker` callback receives the PixiJS 8 `Ticker`, not a delta: read `ticker.deltaTime` |
| `tint` | Not type-checked in development: PixiJS 8 accepts a number, a color string or an array |
| TypeScript | Importing the package types the props of every tag from the PixiJS 8 classes |

### `ParticleContainer`

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

### `RenderLayer`

A `RenderLayer` draws the objects attached to it, where the layer is in the tree. An attached object stays where it is in the scene graph, which gives its transform. Its children in JSX are ordinary children and draw in tree order. Attach and detach objects with refs:

```jsx
import { useLayoutEffect, useRef } from "react";
import { Container, Sprite } from "react-pixi-fiber";
import { RenderLayer } from "@react-pixi-fiber/pixi-8";

function Scene({ texture }) {
  const layer = useRef(null);
  const sprite = useRef(null);
  useLayoutEffect(() => {
    const [target, child] = [layer.current, sprite.current];
    target.attach(child);
    return () => target.detach(child);
  }, []);
  return (
    <Container>
      <Container>
        <Sprite ref={sprite} texture={texture} />
      </Container>
      <RenderLayer ref={layer} />
    </Container>
  );
}
```

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

## Migrating from `@react-pixi-fiber/pixi-7`

1. Install `@react-pixi-fiber/pixi-8` and `pixi.js` 8, and pass `pixi8()` to `configure` instead of `pixi7()`. To keep the PixiJS 7 props while you migrate, pass `pixi8({ compat: "pixi7" })` and import `@react-pixi-fiber/pixi-8/compat/pixi6` for the types.
2. Follow the [PixiJS 8 migration guide](https://pixijs.com/8.x/guides/migrations/v8) for the PixiJS calls in your app.

What changes for `react-pixi-fiber` code:

- `Stage` awaits `app.init()`, so read the application in `onInit`. An existing canvas still goes in `options.view`.
- A `usePixiTicker` callback receives the `Ticker`: `delta => …` becomes `ticker => … ticker.deltaTime …`.
- `buttonMode`, `interactive` and `name` are not PixiJS 8 props: use `cursor`, `eventMode` and `label`, or `compat: "pixi7"`.
- The `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` tags are gone: use `NineSliceSprite`, `MeshSimple`, `MeshPlane` and `MeshRope`.
- `Graphics` passes `context` to the constructor instead of `geometry`; `MeshSimple` takes `topology` instead of `drawMode`.
- `ParticleContainer` takes `<Particle>` children instead of sprites.
- `DOMContainer`, `Particle`, `PerspectiveMesh`, `RenderContainer` and `RenderLayer` are new tags.
- `PixiTypeFallback` is not exported.
- The `DisplayObject` in the `react-pixi-fiber` API names, for example `this.applyDisplayObjectProps` and `DisplayObjectProps`, means `Container` on PixiJS 8. The names stay.
