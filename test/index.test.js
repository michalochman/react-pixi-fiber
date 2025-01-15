import * as ReactPixiFiber from "../src/index";
import CustomPIXIComponent from "../src/CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "../src/AppProvider";
import Stage, { createStageClass } from "../src/Stage";
import { TYPES } from "../src/types";
import { usePixiApp, usePixiTicker } from "../src/hooks";
import { applyDisplayObjectProps } from "../src/ReactPixiFiberComponent";

describe("ReactPixiFiber public API", () => {
  it("should match snapshot", () => {
    expect(ReactPixiFiber).toMatchSnapshot();
  });

  it("provides expected utils", () => {
    expect(ReactPixiFiber.CustomPIXIComponent).toEqual(CustomPIXIComponent);
    expect(ReactPixiFiber.applyDisplayObjectProps).toEqual(applyDisplayObjectProps);
    expect(ReactPixiFiber.createStageClass).toEqual(createStageClass);
    expect(typeof ReactPixiFiber.render).toEqual("function");
    expect(typeof ReactPixiFiber.unmount).toEqual("function");
  });

  it("provides expected context utils", () => {
    expect(ReactPixiFiber.AppContext).toEqual(AppContext);
    expect(ReactPixiFiber.AppProvider).toEqual(AppProvider);
    expect(ReactPixiFiber.withApp).toEqual(withApp);
  });

  it("provides expected hooks", () => {
    expect(ReactPixiFiber.usePixiApp).toEqual(usePixiApp);
    expect(ReactPixiFiber.usePixiTicker).toEqual(usePixiTicker);
  });

  it("provides expected components", () => {
    expect(ReactPixiFiber.BitmapText).toEqual(TYPES.BITMAP_TEXT);
    expect(ReactPixiFiber.Container).toEqual(TYPES.CONTAINER);
    expect(ReactPixiFiber.Graphics).toEqual(TYPES.GRAPHICS);
    expect(ReactPixiFiber.NineSlicePlane).toEqual(TYPES.NINE_SLICE_PLANE);
    expect(ReactPixiFiber.ParticleContainer).toEqual(TYPES.PARTICLE_CONTAINER);
    expect(ReactPixiFiber.Sprite).toEqual(TYPES.SPRITE);
    expect(ReactPixiFiber.Stage).toEqual(Stage);
    expect(ReactPixiFiber.Text).toEqual(TYPES.TEXT);
    expect(ReactPixiFiber.TilingSprite).toEqual(TYPES.TILING_SPRITE);
  });
});
