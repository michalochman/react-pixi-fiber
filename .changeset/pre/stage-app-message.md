---
"react-pixi-fiber": patch
---

The `Stage` error for a rejected `app` prop names the two forms that `Stage` accepts: a `PIXI.Application`, or an object that the PixiJS adapter accepts as one. The pixi-8 adapter accepts an object with a `Container` as `stage`.

`usePixiTicker` throws during render when the `app` has no `ticker`, and the error names the `ticker`.
