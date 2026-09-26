import { useLayoutEffect, useRef, useState } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "../RotatingBunny";
import * as PIXI from "pixi.js";

function CustomApplicationExample() {
  const div = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<PIXI.Application | null>(null);

  useLayoutEffect(() => {
    if (!div.current) {
      return;
    }

    const canvas = document.createElement("canvas");
    div.current.appendChild(canvas);

    const app = new PIXI.Application({
      backgroundColor: 0xbb9910,
      height: 600,
      view: canvas,
      width: 800,
    });
    setApp(app);

    return function cleanup() {
      setApp(null);
      // Destroy children but not their textures: Bunny textures are shared module-level objects,
      // destroying them here would break every Bunny mounted afterwards.
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div ref={div}>
      {app && (
        <Stage app={app}>
          <RotatingBunny x={400} y={300} scale={4} />
        </Stage>
      )}
    </div>
  );
}

export default CustomApplicationExample;
