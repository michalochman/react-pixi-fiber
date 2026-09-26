import ReactDOM from "react-dom";
import * as ReactPixiFiber from "react-pixi-fiber";

// react-pixi like API
// Note: ReactPIXI.factories is not supported

export const CustomPIXIComponent = ReactPixiFiber.CustomPIXIComponent;
// react-pixi exposed the legacy ReactDOM API, keep it for compatibility.
// eslint-disable-next-line react/no-deprecated
export const render = ReactDOM.render;
// eslint-disable-next-line react/no-deprecated
export const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
export const BitmapText = ReactPixiFiber.BitmapText;
export const DisplayObjectContainer = ReactPixiFiber.Container;
export const Graphics = ReactPixiFiber.Graphics;
export const ParticleContainer = ReactPixiFiber.ParticleContainer;
export const Sprite = ReactPixiFiber.Sprite;
export const Stage = ReactPixiFiber.Stage;
export const Text = ReactPixiFiber.Text;
export const TilingSprite = ReactPixiFiber.TilingSprite;

const ReactPIXI = {
  // Render methods
  CustomPIXIComponent,
  render,
  unmountComponentAtNode,
  // Components
  BitmapText,
  DisplayObjectContainer,
  Graphics,
  ParticleContainer,
  Sprite,
  Stage,
  Text,
  TilingSprite,
};

export default ReactPIXI;
