// Type-checked by `check-types`, not run: the compat typings accept the translated props on every tag.
import React from "react";
import * as PIXI from "pixi.js";
import { Container, Sprite } from "react-pixi-fiber";
import "../../compat/pixi6";
import "../../src/index";

export const sprite = (
  <Sprite
    buttonMode
    click={(event: PIXI.FederatedPointerEvent) => event.stopPropagation()}
    interactive
    name="bunny"
    texture={PIXI.Texture.WHITE}
  />
);
export const container = <Container interactive={false} pointerdown={event => event.global} />;
