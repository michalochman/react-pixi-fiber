---
"react-pixi-fiber": patch
---

The error for an `app` prop that the PixiJS adapter rejects no longer says it has to be an instance of `PIXI.Application`. The pixi-8 adapter also accepts an object with a `stage`, so the message now names both.
