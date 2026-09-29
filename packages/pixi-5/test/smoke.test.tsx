import react18 from "@react-pixi-fiber/react-18";
import pixi5 from "../src/index";
import { smokeSuite } from "../../react-pixi-fiber/test/utils/smoke";

smokeSuite("pixi-5 + react-18", () => ({ react: react18(), pixi: pixi5() }));
