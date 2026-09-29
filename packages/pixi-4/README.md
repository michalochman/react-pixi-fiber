# @react-pixi-fiber/pixi-4

PixiJS 4 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 4 display objects for all 13 core tags, which props it types, and how to create a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 4, for TypeScript `@types/pixi.js` 4 (PixiJS 4 ships no typings, so it is an optional peer) and a React adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi4 from "@react-pixi-fiber/pixi-4";

configure({ react: reactN(), pixi: pixi4() });
```

PixiJS 4 has one mesh class, `PIXI.mesh.Mesh(texture, vertices, uvs, indices, drawMode)`, so `Mesh` and `MeshSimple` both create it.

The PixiJS 4 class names work as tags too: `NineSlicePlane`, `Plane` and `Rope` render the same display objects as `NineSliceSprite`, `MeshPlane` and `MeshRope`. Each is a tag of its own: `defaults` and `PIXIProperty` keyed by `NineSliceSprite` do not apply to `<NineSlicePlane />`, and `getInstanceTag` returns `"NineSlicePlane"` for it.

Importing the package also loads its types: the props of every tag follow the PixiJS 4 classes, and the PixiJS 4 event names (`click`, `pointerdown`, …) are typed as props. The types `InteractionCompatibility`, `InteractionEventCompatibility`, `InteractiveComponent` and `PixiTypeFallback` import from this package.
