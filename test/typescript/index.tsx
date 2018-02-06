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
} from 'react-pixi-fiber';

const anchor = new PIXI.ObservablePoint(() => {}, undefined, 0.5, 0.5);

const texture = PIXI.Texture.fromImage('https://i.imgur.com/IaUrttj.png');

const CompositionExample: React.SFC = () => (
  <Container>
    <BitmapText text="" />
  </Container>
);

const StageExample: React.SFC = () => (
  <Stage>
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
