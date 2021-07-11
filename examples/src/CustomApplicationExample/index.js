import React, { useLayoutEffect, useRef, useState } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "../RotatingBunny";
import * as PIXI from "pixi.js";

function CustomApplicationExample() {
  const div = useRef();
  const [app, setApp] = useState(null);

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
      app.destroy(true, true);
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
