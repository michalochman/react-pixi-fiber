import * as PIXI from 'pixi.js';
import * as React from 'react';
import {
  BitmapText,
  Container,
  Graphics,
  ParticleContainer,
  Sprite,
  Stage,
  Text,
  TilingSprite,
  CustomPIXIComponent
} from 'react-pixi-fiber';

const anchor = new PIXI.ObservablePoint(() => {}, undefined, 0.5, 0.5);

const texture = PIXI.Texture.fromImage('https://i.imgur.com/IaUrttj.png');

const CompositionExample: React.SFC = () => (
  <Container>
    <BitmapText text="" />
  </Container>
);

const AnimatedSprite: React.ReactType = CustomPIXIComponent({
  customDisplayObject: (props: any) => new PIXI.extras.AnimatedSprite(props.textures),
  customApplyProps: (animatedSprite: PIXI.extras.AnimatedSprite, oldProps: any, newProps: any) => {},
  customDidAttach: (animatedSprite: PIXI.extras.AnimatedSprite) => {},
  customWillDetach: (animatedSprite: PIXI.extras.AnimatedSprite) => {},
}, 'AnimatedSprite');
const CustomPIXIComponentExample: React.SFC = () => <AnimatedSprite />;

const StageExample: React.SFC = () => (
  <Stage options={{backgroundColor: 0xffffff}}>
    <BitmapText text="" />
    <Container>
      <BitmapText text="" />
    </Container>
    <Graphics />
    <ParticleContainer texture={texture}>
    <BitmapText text="" />
    </ParticleContainer>
    <Sprite anchor={anchor} texture={texture} />
    <Text />
    <TilingSprite texture={texture} />
    <CompositionExample />
  </Stage>
);
