import React from "react";
import { Container, Sprite, Stage } from "react-pixi-fiber";
import TextureRenderer from "./TextureRenderer";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

function SuspenseExample() {
  return (
    <Stage options={OPTIONS}>
      <Container>
        <React.Suspense fallback={null}>
          <TextureRenderer assetUrl="/bunnys.png">{({ texture }) => <Sprite texture={texture} />}</TextureRenderer>
        </React.Suspense>
      </Container>
    </Stage>
  );
}

export default SuspenseExample;
