# @react-pixi-fiber/pixi-8

## 1.0.0-alpha.0

### Major Changes

- [#377](https://github.com/michalochman/react-pixi-fiber/pull/377) [`b5e5be4`](https://github.com/michalochman/react-pixi-fiber/commit/b5e5be46120e80ee101f87775d857a7e190cd633) Thanks [@michalochman](https://github.com/michalochman)! - Initial release. The PixiJS 8 adapter for PixiJS 8.9 or a later 8.x, the first with every tag it exports. It implements the 13 core tags and `DOMContainer`, `HTMLText`, `Particle`, `PerspectiveMesh`, `RenderContainer` and `RenderLayer`. `NineSlicePlane` maps to `NineSliceSprite` and warns once in development. `Graphics` passes `context` to the constructor. `ParticleContainer` takes `Particle` children; a Suspense boundary inside it does not hide its particles, and it cannot be the container passed to `render`. `RenderLayer` draws the objects attached to it with `attach`; its JSX children draw in tree order. `Stage` puts the untyped `Container` props of PixiJS 8, such as `boundsArea`, `cullArea`, `label` and `tint`, on `app.stage`, not on the `<canvas>`.
  
  The default export of `@react-pixi-fiber/pixi-8/compat/pixi6` (also served as `compat/pixi7`), passed as `pixi8({ compat })`, translates the PixiJS 6 and 7 props PixiJS 8 renamed or deprecated: the event names become the `on` handler properties (`click` to `onclick`), `mousemove`, `pointermove` and `touchmove` become `onglobalmousemove`, `onglobalpointermove` and `onglobaltouchmove`, `buttonMode` becomes `cursor`, `interactive` becomes `eventMode` (`"static"` or `"passive"`, as PixiJS 8's setter does), `name` becomes `label` and `uvRespectAnchor` becomes `applyAnchorToTexture`. Each translated prop warns once in development; when the PixiJS 8 prop is also set, it wins and a warning names both. Without the import the adapter holds no compat code.

### Patch Changes

- Updated dependencies [[`446f761`](https://github.com/michalochman/react-pixi-fiber/commit/446f7619b852df4ffdf432d5c032e837f21968ee)]:
  - react-pixi-fiber@3.0.0-alpha.0
