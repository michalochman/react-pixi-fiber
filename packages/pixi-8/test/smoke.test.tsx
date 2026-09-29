import react18 from "@react-pixi-fiber/react-18";
import pixi8 from "../src/index";
import { smokeSuite } from "../../react-pixi-fiber/test/utils/smoke";

smokeSuite("pixi-8 + react-18", () => ({ react: react18(), pixi: pixi8() }));
