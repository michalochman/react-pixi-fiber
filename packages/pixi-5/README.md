# @react-pixi-fiber/pixi-5

PixiJS 5 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 5 display objects for the core tags, which props it types, and how to create a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 5 and a React adapter from the [adapter table](https://github.com/michalochman/react-pixi-fiber/tree/master/packages/react-pixi-fiber#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi5 from "@react-pixi-fiber/pixi-5";

configure({ react: reactN(), pixi: pixi5() });
```

The PixiJS 5 class names work as tags too: `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` render the same display objects as `NineSliceSprite`, `MeshSimple`, `MeshPlane` and `MeshRope`. Each is a tag of its own: `defaults` and `PIXIProperty` keyed by `NineSliceSprite` do not apply to `<NineSlicePlane />`, and `getInstanceTag` returns `"NineSlicePlane"` for it.

Importing the package also loads its types: the props of every tag follow the PixiJS 5 classes, and the PixiJS 5 event names (`click`, `pointerdown`, …) are typed as props. The types `InteractionCompatibility`, `InteractionEventCompatibility`, `InteractiveComponent` and `PixiTypeFallback` import from this package.
