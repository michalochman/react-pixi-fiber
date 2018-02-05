/**
 * Exercise TypeScript definitions
 */

import * as React from 'react';
import { lift, Sprite, SpriteProperties, StagedSFC } from 'react-pixi-fiber';

interface BunnyProperties extends SpriteProperties {}

export const Bunny: StagedSFC<BunnyProperties> = lift((props, context) => (
  <Sprite
    anchor={new PIXI.ObservablePoint(() => {}, undefined, 0.5, 0.5)}
    texture={PIXI.Texture.fromImage("https://i.imgur.com/IaUrttj.png")}
    {...props}
  />
));

/** Exercise `lift` to project a `React.SFC` to a `StagedSFC` */
const Comp = lift((props, context) =>  <Sprite />);
