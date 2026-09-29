import react18 from "@react-pixi-fiber/react-18";
import pixi4 from "../src/index";
import { smokeSuite } from "../../react-pixi-fiber/test/utils/smoke";

// jsdom has no WebGL, PixiJS 4 needs the canvas renderer forced.
const adapter = pixi4();
const pixi = {
  ...adapter,
  createApplication: (options: object) => adapter.createApplication({ ...options, forceCanvas: true }),
};

smokeSuite("pixi-4 + react-18", () => ({ react: react18(), pixi }));
