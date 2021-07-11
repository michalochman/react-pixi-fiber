import React, { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { usePixiTicker, withApp, ParticleContainer, Sprite, Text } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Particle from "./Particle";
import bunnysImage from "./bunnys.png";

const maxSize = 200000;
const bunniesAddedPerFrame = 100;
const gravity = 0.5;
const maxX = 800;
const maxY = 600;
const minX = 0;
const minY = 0;

const bunnyAnchor = new PIXI.Point(0.5, 1);
const particleContainerProperties = {
  scale: false,
  position: true,
  rotation: false,
  uvs: false,
  tint: false,
};

const generateBunny = texture => ({
  speedX: Math.random() * 10,
  speedY: Math.random() * 10 - 5,
  texture: texture,
});

const moveBunny = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  this.speedY += gravity;

  if (this.x > maxX) {
    this.speedX *= -1;
    this.x = maxX;
  } else if (this.x < minX) {
    this.speedX *= -1;
    this.x = minX;
  }

  if (this.y > maxY) {
    this.speedY *= -0.85;
    this.y = maxY;
    if (Math.random() > 0.5) {
      this.speedY -= Math.random() * 6;
    }
  } else if (this.y < minY) {
    this.speedY = 0;
    this.y = minY;
  }
};

function CustomBunnymark() {
  const particleContainer = useRef(null);
  const [bunnys, setBunnys] = useState([]);
  const [bunnyTextures, setBunnyTextures] = useState([]);
  const [currentTexture, setCurrentTexture] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useLayoutEffect(() => {
    const bunnyTextures = new PIXI.Texture.from(bunnysImage);
    const bunny1 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 47, 26, 37));
    const bunny2 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 86, 26, 37));
    const bunny3 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 125, 26, 37));
    const bunny4 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 164, 26, 37));
    const bunny5 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 2, 26, 37));

    setBunnyTextures([bunny1, bunny2, bunny3, bunny4, bunny5]);
    const currentTexture = 2;
    setBunnys([generateBunny(currentTexture), generateBunny(currentTexture)]);
    setCurrentTexture(currentTexture);
  }, []);

  const animate = useCallback(() => {
    if (isAdding) {
      const addedBunnys = [];

      if (bunnys.length < maxSize) {
        for (let i = 0; i < bunniesAddedPerFrame; i++) {
          addedBunnys.push(generateBunny(currentTexture));
        }
      }
      const newBunnys = bunnys.concat(addedBunnys);

      setBunnys(newBunnys);
    }

    if (particleContainer.current) {
      particleContainer.current.children.forEach(bunny => bunny.update(bunny));
    }
  }, [bunnys, currentTexture, isAdding]);

  usePixiTicker(animate);

  const handlePointerDown = useCallback(() => {
    setIsAdding(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setCurrentTexture(currentTexture => (currentTexture + 1) % 5);
    setIsAdding(false);
  }, []);

  return (
    <Fragment>
      <ParticleContainer ref={particleContainer} maxSize={maxSize} properties={particleContainerProperties}>
        {bunnys.map((bunny, i) => (
          <Particle
            key={i}
            anchor={bunnyAnchor}
            update={moveBunny}
            speedX={bunny.speedX}
            speedY={bunny.speedY}
            texture={bunnyTextures[bunny.texture]}
          />
        ))}
      </ParticleContainer>
      <Text text={`${bunnys.length} BUNNIES`} style={{ fill: 0xffff00, fontSize: 14 }} x={5} y={5} />
      {/* ParticleContainer and its children cannot be interactive
            so here's a clickable hit area */}
      <Sprite
        height={600}
        interactive
        pointerdown={handlePointerDown}
        pointerup={handlePointerUp}
        texture={PIXI.Texture.EMPTY}
        width={800}
      />
    </Fragment>
  );
}
CustomBunnymark.propTypes = {
  app: PropTypes.object,
};

export default withApp(CustomBunnymark);
