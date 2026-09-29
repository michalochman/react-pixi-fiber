import react17 from "../src/index";
import { fakePixiAdapter } from "../../react-pixi-fiber/test/utils/fakePixiAdapter";
import { smokeSuite } from "../../react-pixi-fiber/test/utils/smoke";

smokeSuite("react-17 + fake PixiJS", () => ({ react: react17(), pixi: fakePixiAdapter({ async: true }) }));
