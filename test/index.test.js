import * as ReactPixiFiber from "../src/index";

describe("ReactPixiFiber public API", () => {
  it("provides expected utils", () => {
    expect(ReactPixiFiber.AppContext).toBeDefined();
    expect(ReactPixiFiber.AppProvider).toBeDefined();
    expect(ReactPixiFiber.CustomPIXIComponent).toBeDefined();
    expect(ReactPixiFiber.applyDisplayObjectProps).toBeDefined();
    expect(ReactPixiFiber.createStageClass).toBeDefined();
    expect(ReactPixiFiber.render).toBeDefined();
    expect(ReactPixiFiber.unmount).toBeDefined();
    expect(ReactPixiFiber.unstable_batchedUpdates).toBeDefined();
    expect(ReactPixiFiber.withApp).toBeDefined();
  });

  it("provides expected hooks", () => {
    expect(ReactPixiFiber.usePixiApp).toBeDefined();
    expect(ReactPixiFiber.usePixiTicker).toBeDefined();
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
