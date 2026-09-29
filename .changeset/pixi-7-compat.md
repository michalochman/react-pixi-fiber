---
"@react-pixi-fiber/pixi-7": major
---

`@react-pixi-fiber/pixi-7/compat/pixi6` translates the PixiJS 6 props that PixiJS 7 no longer calls or reads: pass its default export as `pixi7({ compat })`. The event names become the `on` handler properties, `mousemove`, `pointermove` and `touchmove` the `onglobal*move` ones, `buttonMode` becomes `cursor` and `interactive` becomes `eventMode`. Without it, these props warn once in development.
