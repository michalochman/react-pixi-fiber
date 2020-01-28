import * as PIXI from "pixi.js";
import * as React from "react";
import {
  BitmapText,
  Container,
  Graphics,
  ParticleContainer,
  Sprite,
  Stage,
  Text,
  TilingSprite,
  CustomPIXIComponent,
} from "react-pixi-fiber";

const anchor = new PIXI.ObservablePoint(() => {}, undefined, 0.5, 0.5);

const texture = PIXI.Texture.from("https://i.imgur.com/IaUrttj.png");

const CompositionExample: React.FC = () => (
  <Container>
    <BitmapText text="" />
  </Container>
);

const AnimatedSprite: React.ReactType = CustomPIXIComponent(
  {
    customDisplayObject: (props: any) => new PIXI.AnimatedSprite(props.textures),
    customApplyProps: (animatedSprite: PIXI.AnimatedSprite, oldProps: any, newProps: any) => {},
    customDidAttach: (animatedSprite: PIXI.AnimatedSprite) => {},
    customWillDetach: (animatedSprite: PIXI.AnimatedSprite) => {},
  },
  "AnimatedSprite"
);
const CustomPIXIComponentExample: React.FC = () => <AnimatedSprite />;

const StageExample: React.FC = () => {
  const stageRef = React.useRef(null);
  const spriteRef = React.useRef(null);

  return (
    <Stage options={{ backgroundColor: 0xffffff }} ref={stageRef}>
      <BitmapText text="" />
      <Container>
        <BitmapText text="" />
      </Container>
      <Graphics />
      <ParticleContainer autoResize={false}>
        <Sprite texture={PIXI.Texture.WHITE} />
      </ParticleContainer>
      <Sprite anchor={anchor} texture={texture} ref={spriteRef} />
      <Text />
      <TilingSprite texture={texture} />
      <CompositionExample />
    </Stage>
  );
};
