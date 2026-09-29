# @react-pixi-fiber/pixi-7

PixiJS 7 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 7 display objects for all 13 core tags, which props it types, and how to create a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 7 and a React adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi7 from "@react-pixi-fiber/pixi-7";

configure({ react: reactN(), pixi: pixi7() });
```

## Supported features

Features that are plain PixiJS work as the [PixiJS 7 documentation](https://pixijs.download/v7.4.3/docs/index.html) describes.

| Tag | Creates |
| --- | --- |
| `AnimatedSprite` | `PIXI.AnimatedSprite` |
| `BitmapText` | `PIXI.BitmapText` |
| `Container` | `PIXI.Container` |
| `Graphics` | `PIXI.Graphics`, `geometry` is passed to the constructor |
| `HTMLText` | `PIXI.HTMLText`, a tag of this adapter; import it from this package |
| `Mesh` | `PIXI.Mesh`, from `geometry`, `shader`, `state` and `drawMode` |
| `MeshPlane`, `SimplePlane` | `PIXI.SimplePlane` |
| `MeshRope`, `SimpleRope` | `PIXI.SimpleRope` |
| `MeshSimple`, `SimpleMesh` | `PIXI.SimpleMesh` |
| `NineSliceSprite`, `NineSlicePlane` | `PIXI.NineSlicePlane` |
| `ParticleContainer` | `PIXI.ParticleContainer` |
| `Sprite` | `PIXI.Sprite` |
| `Text` | `PIXI.Text` |
| `TilingSprite` | `PIXI.TilingSprite` |

`NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` are the PixiJS 7 class names. Each is a tag of its own: `defaults` and `PIXIProperty` keyed by `NineSliceSprite` do not apply to `<NineSlicePlane />`, and `getInstanceTag` returns `"NineSlicePlane"` for it. Import them from this package.

| Feature | Support |
| --- | --- |
| Application | `Stage` creates a `PIXI.Application` from `options`; `view` defaults to the canvas `Stage` renders |
| `defaults` option | `pixi7({ defaults: { Text: { text: "" } } })` sets, per tag, the value a prop returns to when it is set to `undefined`. Without it, a prop returns to the value the instance had before the first write |
| Events | The PixiJS 7 handler properties as props: `onclick`, `onpointerdown`, …. PixiJS 7 does not call a property named after the event, so `click={fn}` or `pointerdown={fn}` is set on the instance but never runs. `interactive` and `buttonMode` are typed; `eventMode` and `cursor` are set as written |
| Ticker | A `usePixiTicker` callback receives the frame delta, as `app.ticker.add` passes it |
| TypeScript | Importing the package types the props of every tag from the PixiJS 7 classes; type event handlers with `FederatedPointerEvent` from `pixi.js`. `PixiTypeFallback` imports from this package |

## Migrating from `@react-pixi-fiber/pixi-6`

1. Install `@react-pixi-fiber/pixi-7` and `pixi.js` 7, and pass `pixi7()` to `configure` instead of `pixi6()`.
2. Follow the [PixiJS 7 migration guide](https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide) for the PixiJS calls in your app.

What changes for `react-pixi-fiber` code:

- `HTMLText` is a new tag.
- Rename the event props to the handler properties: `click` to `onclick`, `pointerdown` to `onpointerdown`, and so on. PixiJS 7 calls only the `on` properties, so an event prop left as `click` is set on the instance but never runs.
- `InteractionCompatibility`, `InteractionEventCompatibility` and `InteractiveComponent` are not exported: PixiJS 7 has no `PIXI.InteractionEvent`. Type event handlers with `FederatedPointerEvent`.
