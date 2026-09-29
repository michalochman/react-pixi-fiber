# @react-pixi-fiber/pixi-6

PixiJS 6 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 6 display objects for the core tags, which props it types, and how to create a `PIXI.Application`. Install it next to `react-pixi-fiber`, `pixi.js` 6 and the React adapter for your React major, then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixi6 from "@react-pixi-fiber/pixi-6";

configure({ react: react18(), pixi: pixi6() });
```

The PixiJS 6 class names work as tags too: `SimpleMesh`, `SimplePlane`, `SimpleRope` and `NineSlicePlane` render the same display objects as `MeshSimple`, `MeshPlane`, `MeshRope` and `NineSliceSprite`.

Importing the package also loads its types: the props of every tag follow the PixiJS 6 classes, and the PixiJS 6 event names (`click`, `pointerdown`, …) are typed as props.
