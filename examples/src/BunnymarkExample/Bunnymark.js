import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withApp, ParticleContainer, Sprite, Text } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import bunnys from "./bunnys.png";

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
  x: 0,
  y: 0,
});

const moveBunny = bunny => {
  const movedBunny = { ...bunny };

  movedBunny.x += movedBunny.speedX;
  movedBunny.y += movedBunny.speedY;
  movedBunny.speedY += gravity;

  if (movedBunny.x > maxX) {
    movedBunny.speedX *= -1;
    movedBunny.x = maxX;
  } else if (movedBunny.x < minX) {
    movedBunny.speedX *= -1;
    movedBunny.x = minX;
  }

  if (movedBunny.y > maxY) {
    movedBunny.speedY *= -0.85;
    movedBunny.y = maxY;
    if (Math.random() > 0.5) {
      movedBunny.speedY -= Math.random() * 6;
    }
  } else if (movedBunny.y < minY) {
    movedBunny.speedY = 0;
    movedBunny.y = minY;
  }

  return movedBunny;
};

class Bunnymark extends Component {
  state = {
    bunnys: [],
    currentTexture: 0,
    isAdding: false,
  };

  componentDidMount() {
    const bunnyTextures = new PIXI.Texture.fromImage(bunnys);
    const bunny1 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 47, 26, 37));
    const bunny2 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 86, 26, 37));
    const bunny3 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 125, 26, 37));
    const bunny4 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 164, 26, 37));
    const bunny5 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 2, 26, 37));

    this.bunnyTextures = [bunny1, bunny2, bunny3, bunny4, bunny5];
    const currentTexture = 2;
    this.setState({
      bunnys: [generateBunny(currentTexture), generateBunny(currentTexture)],
      currentTexture: currentTexture,
    });

    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
  }

  animate = () => {
    const { bunnys, currentTexture, isAdding } = this.state;
    const addedBunnys = [];

    if (isAdding) {
      if (bunnys.length < maxSize) {
        for (let i = 0; i < bunniesAddedPerFrame; i++) {
          addedBunnys.push(generateBunny(currentTexture));
        }
      }
    }

    const newBunnys = bunnys.concat(addedBunnys).map(moveBunny);

    this.setState({ bunnys: newBunnys });
  };

  handlePointerDown = () => {
    this.setState({ isAdding: true });
  };

  handlePointerUp = () => {
    this.setState(state => ({
      currentTexture: (state.currentTexture + 1) % 5,
    }));

    this.setState({ isAdding: false });
  };

  render() {
    const { bunnys } = this.state;

    return (
      <Fragment>
        <ParticleContainer maxSize={maxSize} properties={particleContainerProperties}>
          {bunnys.map((bunny, i) => (
            <Sprite key={i} anchor={bunnyAnchor} texture={this.bunnyTextures[bunny.texture]} x={bunny.x} y={bunny.y} />
          ))}
        </ParticleContainer>
        <Text text={`${bunnys.length} BUNNIES`} style={{ fill: 0xffff00, fontSize: 14 }} x={5} y={5} />
        {/* ParticleContainer and its children cannot be interactive
            so here's a clickable hit area */}
        <Sprite
          height={600}
          interactive
          pointerdown={this.handlePointerDown}
          pointerup={this.handlePointerUp}
          texture={PIXI.Texture.EMPTY}
          width={800}
        />
      </Fragment>
    );
  }
}
Bunnymark.propTypes = {
  app: PropTypes.object,
};

export default withApp(Bunnymark);
