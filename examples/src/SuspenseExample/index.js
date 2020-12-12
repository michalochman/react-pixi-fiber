import React, { Component } from "react";
import { Container, Sprite, Stage } from "react-pixi-fiber";
import { createAsset } from "use-asset";
import * as PIXI from "pixi.js";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

const spriteSheet = createAsset(() => import("./bunnys.png"), Infinity);

function SpriteRenderer() {
  const sheet = spriteSheet.read().default;

  return <Sprite texture={PIXI.Texture.from(sheet)} />;
}

class SuspenseExample extends Component {
  render() {
    return (
      <Stage options={OPTIONS}>
        <Container>
          <React.Suspense fallback={null}>
            <SpriteRenderer />
          </React.Suspense>
        </Container>
      </Stage>
    );
  }
}

export default SuspenseExample;
