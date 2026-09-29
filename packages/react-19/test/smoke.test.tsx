import react19 from "../src/index";
import { fakePixiAdapter } from "../../react-pixi-fiber/test/utils/fakePixiAdapter";
import { smokeSuite } from "../../react-pixi-fiber/test/utils/smoke";

smokeSuite("react-19 + fake PixiJS", () => ({
  react: react19(),
  pixi: fakePixiAdapter({ async: true }),
}));
