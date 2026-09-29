# @react-pixi-fiber/pixi-8

PixiJS 8 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 8 display objects for all 13 core tags, which props it types, and how to create and initialize a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 8.9 or newer (the first with every tag this adapter exports) and a React adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

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
| Application | `Stage` creates a `PIXI.Application` and awaits `app.init(options)`, then renders its children and calls `onInit(app)`. An existing canvas goes in `options.canvas`, or in 2.x's `options.view`, which wins when both are given; without either, the application draws on the canvas `Stage` renders |
| `compat` option | Takes the translator from `@react-pixi-fiber/pixi-8/compat/pixi6` or `/compat/pixi7`, which translates the PixiJS 6 and 7 props, see [below](#compatibility-with-the-2x-props) |
| `defaults` option | Default props per tag, like React's `defaultProps`: with `pixi8({ defaults: { Sprite: { alpha: 0.5 } } })`, `<Sprite />` mounts with `alpha` 0.5. A prop missing or `undefined` when the instance is created gets its default, and `create` sees it; a prop removed later, or set to `undefined`, returns to it. An explicit `null` is kept. Key each tag as you write it. Without an entry, a removed prop returns to the value the instance had before the first write, see [Default props per tag](../react-pixi-fiber/README.md#default-props-per-tag) |
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

Apps written for PixiJS 6 or 7 can keep their props while they migrate. Pass the default export of the compat module to `pixi8`:

```js
import pixi8 from "@react-pixi-fiber/pixi-8";
import compat from "@react-pixi-fiber/pixi-8/compat/pixi6"; // or ".../compat/pixi7", the same module

configure({ react: reactN(), pixi: pixi8({ compat }) });
```

PixiJS 4 and 5 apps use `compat/pixi6`: PixiJS 5 and 6 renamed none of the props it translates. Without the import, the adapter holds no compat code.

With `compat`, the adapter translates the props before the core reads them:

| Prop | Becomes |
| --- | --- |
| `buttonMode` | `cursor: "pointer"`, or `cursor: null` when false |
| `click`, `pointerdown`, … (the event names) | `onclick`, `onpointerdown`, … |
| `interactive` | `eventMode: "static"`, or `eventMode: "passive"` when false, as the PixiJS 8 `interactive` setter does |
| `mousemove`, `pointermove`, `touchmove` | `onglobalmousemove`, `onglobalpointermove`, `onglobaltouchmove`: the handler runs on every move, over the object or not, as in PixiJS 6 |
| `name` | `label` |
| `uvRespectAnchor` | `applyAnchorToTexture` |

In development each translated prop warns once, naming the PixiJS 8 prop to use instead. When a translated prop and its PixiJS 8 prop are both passed (`interactive` and `eventMode`), the PixiJS 8 prop wins, with one warning naming both. A `PIXIComponent` with its own `applyProps` receives the props as written.

The compat module also types the translated props on every tag, as deprecated, so TypeScript needs no other import.

Not translated: `cacheAsBitmap` still works in PixiJS 8 (its replacement `cacheAsTexture` is a method, not a prop); `isMask` and the `BitmapText` props that PixiJS 8 moved into `style` have no prop to rename to.

## Migrating from `@react-pixi-fiber/pixi-7`

1. Install `@react-pixi-fiber/pixi-8` and `pixi.js` 8.9 or newer, and pass `pixi8()` to `configure` instead of `pixi7()`. To keep the PixiJS 7 props while you migrate, pass `compat` from `@react-pixi-fiber/pixi-8/compat/pixi7`, see [above](#compatibility-with-the-2x-props).
2. Follow the [PixiJS 8 migration guide](https://pixijs.com/8.x/guides/migrations/v8) for the PixiJS calls in your app.

What changes for `react-pixi-fiber` code:

- `Stage` awaits `app.init()`, so read the application in `onInit`. An existing canvas goes in `options.canvas`; 2.x's `options.view` still works.
- A `usePixiTicker` callback receives the `Ticker`: `delta => …` becomes `ticker => … ticker.deltaTime …`.
- `interactive`, `name` and `uvRespectAnchor` are deprecated in PixiJS 8 and `buttonMode` is gone: use `eventMode`, `label`, `applyAnchorToTexture` and `cursor`, or the compat module.
- The `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` tags are gone: use `NineSliceSprite`, `MeshSimple`, `MeshPlane` and `MeshRope`.
- `Graphics` passes `context` to the constructor instead of `geometry`; `MeshSimple` takes `topology` instead of `drawMode`.
- `ParticleContainer` takes `<Particle>` children instead of sprites.
- `DOMContainer`, `Particle`, `PerspectiveMesh`, `RenderContainer` and `RenderLayer` are new tags.
- `PixiTypeFallback` is not exported.
- The `DisplayObject` in the `react-pixi-fiber` API names, for example `this.applyDisplayObjectProps` and `DisplayObjectProps`, means `Container` on PixiJS 8. The names stay.
