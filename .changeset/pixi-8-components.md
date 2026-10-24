---
"@react-pixi-fiber/pixi-8": minor
---

`pixi8WithComponents` takes the PixiJS classes that the app renders as `components`. A bundle of the ES build holds only those classes. `pixi8()` keeps every class:

```js
import { Application, Container, Sprite, Text } from "pixi.js";
import { pixi8WithComponents } from "@react-pixi-fiber/pixi-8";

configure({ react: react18(), pixi: pixi8WithComponents({ components: { Application, Container, Sprite, Text } }) });
```

A tag left out of the list throws at first render, and the error names the class to add. `ParticleContainer` needs `Particle` in the list. Without `Application` in the list, `Stage` needs an `app` prop. That `app` needs a `Container` as `stage`, and a `ticker` for `usePixiTicker`. So an app can make its own renderer. `allComponents` holds every class that `pixi8()` uses.
