import * as ReactPIXI from "../../src/react-pixi-alias/index";
import * as ReactPixi from "../../src/index";
import ReactDOM from "react-dom";

describe("react-pixi-alias", () => {
  it("provides expected methods", () => {
    expect(ReactPIXI.CustomPIXIComponent).toEqual(ReactPixi.CustomPIXIComponent);
    expect(ReactPIXI.render).toEqual(ReactDOM.render);
    expect(ReactPIXI.unmountComponentAtNode).toEqual(ReactDOM.unmountComponentAtNode);
  });

  it("provides expected components", () => {
    expect(ReactPIXI.BitmapText).toEqual(ReactPixi.BitmapText);
    expect(ReactPIXI.DisplayObjectContainer).toEqual(ReactPixi.Container);
    expect(ReactPIXI.Graphics).toEqual(ReactPixi.Graphics);
    expect(ReactPIXI.ParticleContainer).toEqual(ReactPixi.ParticleContainer);
    expect(ReactPIXI.Sprite).toEqual(ReactPixi.Sprite);
    expect(ReactPIXI.Stage).toEqual(ReactPixi.Stage);
    expect(ReactPIXI.Text).toEqual(ReactPixi.Text);
    expect(ReactPIXI.TilingSprite).toEqual(ReactPixi.TilingSprite);
  });
});
