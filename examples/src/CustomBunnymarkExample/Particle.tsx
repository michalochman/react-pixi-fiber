import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

export type ParticleProps = {
  speedX: number;
  speedY: number;
  texture: PIXI.Texture;
  update: (this: ParticleInstance, particle: ParticleInstance) => void;
};

// Props not known to PixiJS (`speedX`, `speedY`, `update`) are set on the instance by react-pixi-fiber.
export class ParticleInstance extends PIXI.Sprite implements Partial<ParticleProps> {
  speedX = 0;
  speedY = 0;
  update?: ParticleProps["update"];
}

const PARTICLE = "Particle";

export default CustomPIXIComponent<ParticleInstance, ParticleProps>(
  {
    customDisplayObject: props => new ParticleInstance(props.texture),
    customApplyProps: function (instance, oldProps, newProps) {
      if (typeof oldProps !== "undefined" && Object.keys(oldProps).length === 0) {
        return;
      }

      this.applyDisplayObjectProps(oldProps, newProps);
    },
  },
  PARTICLE
);
