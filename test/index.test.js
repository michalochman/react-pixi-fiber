import * as ReactPixiFiber from "../src/index";

describe("ReactPixiFiber public API", () => {
  it("provides expected utils", () => {
    expect(ReactPixiFiber.CustomPIXIComponent).toBeDefined();
    expect(ReactPixiFiber.render).toBeDefined();
  });
  it("provides expected components", () => {
    expect(ReactPixiFiber.BitmapText).toBeDefined();
    expect(ReactPixiFiber.Container).toBeDefined();
    expect(ReactPixiFiber.Graphics).toBeDefined();
    expect(ReactPixiFiber.ParticleContainer).toBeDefined();
    expect(ReactPixiFiber.Sprite).toBeDefined();
    expect(ReactPixiFiber.Stage).toBeDefined();
    expect(ReactPixiFiber.Text).toBeDefined();
    expect(ReactPixiFiber.TilingSprite).toBeDefined();
  });
});
