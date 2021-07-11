import React, { Fragment, useCallback, useEffect, useState } from "react";
import { render, unstable_batchedUpdates } from "react-pixi-fiber";
import Bunny from "../Bunny";
import * as PIXI from "pixi.js";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};
const asyncFunc = cb => {
  setTimeout(cb, 100);
};

function Canvas() {
  const mountStage = useCallback(canvasEl => {
    const app = new PIXI.Application({
      ...OPTIONS,
      view: canvasEl,
    });
    render(<BatchedUpdatesExample />, app.stage);
  }, []);

  return <canvas ref={mountStage} />;
}

function BatchedUpdatesExample() {
  console.log("`render` called");

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const setStateTwice = useCallback(() => {
    setPosition({
      x: 100,
      y: 200,
    });
    setPosition({
      x: 300,
      y: 400,
    });
  }, []);

  // auto batched in life cycle
  // render once
  useEffect(setStateTwice, [setStateTwice]);

  const batchedUpdate = useCallback(() => {
    // render once
    asyncFunc(unstable_batchedUpdates(setStateTwice));
  }, [setStateTwice]);

  const normalUpdate = useCallback(() => {
    // render twice
    asyncFunc(setStateTwice);
  }, [setStateTwice]);

  const width = 800;
  const height = 600;
  return (
    <Fragment>
      <Bunny x={position.x} y={position.y} interactive pointerdown={normalUpdate} />
      <Bunny x={width - position.x} y={height - position.y} interactive pointerdown={batchedUpdate} />
    </Fragment>
  );
}

export default Canvas;
