import { useCallback, useState } from "react";
import { Stage } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Bunny from "../Bunny";

// Scale mode for all textures, will retain pixelation
PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

// http://pixijs.io/examples/#/basics/click.js
function ClickExample() {
  const [scale, setScale] = useState(1);
  const handleClick = useCallback(() => {
    setScale(scale => scale * 1.25);
  }, []);

  return (
    <Stage options={OPTIONS}>
      <Bunny
        // Shows hand cursor
        cursor="pointer"
        // Opt-in to interactivity
        eventMode="static"
        // Pointers normalize touch and mouse
        onpointerdown={handleClick}
        scale={new PIXI.Point(scale, scale)}
        x={400}
        y={300}
      />
    </Stage>
  );
}

export default ClickExample;
