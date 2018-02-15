import * as ReactPixiFiber from "react-pixi-fiber";
import ReactDOM from "react-dom";

// react-pixi like API
// Note: ReactPIXI.factories and ReactPIXI.CustomPIXIComponent are not supported
const ReactPIXI = {
  // Render methods
  CustomPIXIComponent: ReactPixiFiber.CustomPIXIComponent,
  render: ReactDOM.render,
  unmountComponentAtNode: ReactDOM.unmountComponentAtNode,
  // Components
  BitmapText: ReactPixiFiber.BitmapText,
  DisplayObjectContainer: ReactPixiFiber.Container,
  Graphics: ReactPixiFiber.Graphics,
  ParticleContainer: ReactPixiFiber.ParticleContainer,
  Sprite: ReactPixiFiber.Sprite,
  Stage: ReactPixiFiber.Stage,
  Text: ReactPixiFiber.Text,
  TilingSprite: ReactPixiFiber.TilingSprite,
};

export default ReactPIXI;
