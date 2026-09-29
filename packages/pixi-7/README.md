# @react-pixi-fiber/pixi-7

PixiJS 7 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It tells `react-pixi-fiber` how to create the PixiJS 7 display objects for the core tags, which props it types, and how to create a `PIXI.Application`.

Install it next to `react-pixi-fiber`, `pixi.js` 7 and a React adapter from the [adapter table](https://github.com/michalochman/react-pixi-fiber/tree/master/packages/react-pixi-fiber#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import reactN from "@react-pixi-fiber/react-N"; // the React adapter for your React version
import pixi7 from "@react-pixi-fiber/pixi-7";

configure({ react: reactN(), pixi: pixi7() });
```

`HTMLText` is a tag of this adapter that renders a `PIXI.HTMLText`.

The PixiJS 7 class names work as tags too: `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` render the same display objects as `NineSliceSprite`, `MeshSimple`, `MeshPlane` and `MeshRope`. Each is a tag of its own: `defaults` and `PIXIProperty` keyed by `NineSliceSprite` do not apply to `<NineSlicePlane />`, and `getInstanceTag` returns `"NineSlicePlane"` for it.

Importing the package also loads its types: the props of every tag follow the PixiJS 7 classes. PixiJS 7 fires the event names (`click`, `pointerdown`, …) and the `onclick`, `onpointerdown`, … properties, and both spellings are accepted as props. The type `PixiTypeFallback` imports from this package.
