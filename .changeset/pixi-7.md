---
"@react-pixi-fiber/pixi-7": major
---

Initial release. The PixiJS 7 adapter for PixiJS 7.2 or a later 7.x, the first with `eventMode`. It implements the 13 core tags and `HTMLText`, and keeps `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` as tags for `NineSliceSprite`, `MeshSimple`, `MeshPlane` and `MeshRope`. `Graphics` passes `geometry` to the constructor. It exports the `PixiTypeFallback` type.

The default export of `@react-pixi-fiber/pixi-7/compat/pixi6`, passed as `pixi7({ compat })`, translates the PixiJS 6 props: the event names become the `on` handler properties (`click` to `onclick`), `mousemove`, `pointermove` and `touchmove` become `onglobalmousemove`, `onglobalpointermove` and `onglobaltouchmove`, `buttonMode` becomes `cursor` (`"pointer"` or `null`) and `interactive` becomes `eventMode` (`"static"` or `"auto"`, as PixiJS 7's deprecated setter does). Each translated prop warns once in development; when the PixiJS 7 prop is also set, it wins and a warning names both. Without `compat`, the event names and `buttonMode`, which PixiJS 7 ignores, warn once per prop name in development.
