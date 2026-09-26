import * as ReactPIXI from "../../src/react-pixi-alias/index";
import * as ReactPixiFiber from "react-pixi-fiber";
import ReactDOM from "react-dom";

describe("react-pixi-alias", () => {
  it("provides expected methods", () => {
    expect(ReactPIXI.CustomPIXIComponent).toEqual(ReactPixiFiber.CustomPIXIComponent);
    expect(ReactPIXI.render).toEqual(ReactDOM.render);
    expect(ReactPIXI.unmountComponentAtNode).toEqual(ReactDOM.unmountComponentAtNode);
  });

  it("provides expected components", () => {
    expect(ReactPIXI.BitmapText).toEqual(ReactPixiFiber.BitmapText);
    expect(ReactPIXI.DisplayObjectContainer).toEqual(ReactPixiFiber.Container);
    expect(ReactPIXI.Graphics).toEqual(ReactPixiFiber.Graphics);
    expect(ReactPIXI.ParticleContainer).toEqual(ReactPixiFiber.ParticleContainer);
    expect(ReactPIXI.Sprite).toEqual(ReactPixiFiber.Sprite);
    expect(ReactPIXI.Stage).toEqual(ReactPixiFiber.Stage);
    expect(ReactPIXI.Text).toEqual(ReactPixiFiber.Text);
    expect(ReactPIXI.TilingSprite).toEqual(ReactPixiFiber.TilingSprite);
  });
});
