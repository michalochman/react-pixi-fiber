# @react-pixi-fiber/pixi-6

PixiJS 6 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 6 display objects for all 13 core tags, which props it types, and how to create a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 6 and a React adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi6 from "@react-pixi-fiber/pixi-6";

configure({ react: reactN(), pixi: pixi6() });
```

The PixiJS 6 class names work as tags too: `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` render the same display objects as `NineSliceSprite`, `MeshSimple`, `MeshPlane` and `MeshRope`. Each is a tag of its own: `defaults` and `PIXIProperty` keyed by `NineSliceSprite` do not apply to `<NineSlicePlane />`, and `getInstanceTag` returns `"NineSlicePlane"` for it.

Importing the package also loads its types: the props of every tag follow the PixiJS 6 classes, and the PixiJS 6 event names (`click`, `pointerdown`, …) are typed as props. The types `InteractionCompatibility`, `InteractionEventCompatibility`, `InteractiveComponent` and `PixiTypeFallback` import from this package.
