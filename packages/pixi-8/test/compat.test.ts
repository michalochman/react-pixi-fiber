import { describe, it, expect, vi, afterEach } from "vitest";
import pixi8 from "../src/index";

describe('pixi8({ compat: "pixi6" })', () => {
  afterEach(() => vi.restoreAllMocks());
  it("renames interactive, buttonMode and the legacy event props, warning once per name in development", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const adapter = pixi8({ compat: "pixi6" });
    const fn = () => {};
    const out = adapter.translateProps!("Sprite", {
      buttonMode: true,
      click: fn,
      interactive: true,
      pointerdown: fn,
      x: 1,
    });
    expect(out).toEqual({ cursor: "pointer", eventMode: "static", onclick: fn, onpointerdown: fn, x: 1 });
    adapter.translateProps!("Sprite", { buttonMode: false, interactive: false });
    expect(adapter.translateProps!("Sprite", { interactive: false })).toEqual({ eventMode: "none" });
    expect(error.mock.calls.filter(c => /is a PixiJS 6 prop/.test(c[0]))).toHaveLength(__DEV__ ? 4 : 0);
  });
  it("names the replacement prop in the warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    pixi8({ compat: "pixi6" }).translateProps!("Sprite", { click: 1, interactive: true });
    const messages = error.mock.calls.map(c => c[0]);
    expect(messages.filter(m => /`click`.*Rename it to `onclick`/.test(m))).toHaveLength(__DEV__ ? 1 : 0);
    expect(messages.filter(m => /`interactive`.*Rename it to `eventMode`/.test(m))).toHaveLength(__DEV__ ? 1 : 0);
  });
  it("renames name to label, which PixiJS 8 renamed on Container", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(pixi8({ compat: "pixi6" }).translateProps!("Sprite", { name: "bunny" })).toEqual({ label: "bunny" });
    expect(error.mock.calls.filter(c => /`name`.*Rename it to `label`/.test(c[0]))).toHaveLength(__DEV__ ? 1 : 0);
  });
  it("lets the PixiJS 8 prop win over the translated one, warning once naming both", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const adapter = pixi8({ compat: "pixi6" });
    const fn = () => {};
    const other = () => {};
    expect(adapter.translateProps!("Sprite", { eventMode: "dynamic", interactive: true })).toEqual({
      eventMode: "dynamic",
    });
    expect(adapter.translateProps!("Sprite", { interactive: true, eventMode: "dynamic" })).toEqual({
      eventMode: "dynamic",
    });
    expect(adapter.translateProps!("Sprite", { click: fn, onclick: other })).toEqual({ onclick: other });
    const both = error.mock.calls.map(c => c[0]).filter(m => /are both set/.test(m));
    expect(both).toHaveLength(__DEV__ ? 2 : 0);
    if (__DEV__) {
      expect(both[0]).toMatch(/`interactive` and `eventMode`.*`eventMode` wins/);
      expect(both[1]).toMatch(/`click` and `onclick`.*`onclick` wins/);
    }
  });
  it("returns the same props object when nothing is renamed", () => {
    const props = { foo: 1 };
    expect(pixi8({ compat: "pixi6" }).translateProps!("Sprite", props)).toBe(props);
  });
});

describe('pixi8({ compat: "pixi7" })', () => {
  afterEach(() => vi.restoreAllMocks());
  it("uses the same table and names PixiJS 7 in the warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(pixi8({ compat: "pixi7" }).translateProps!("Sprite", { click: 1, name: "a" })).toEqual({
      label: "a",
      onclick: 1,
    });
    const messages = error.mock.calls.map(c => c[0]);
    expect(messages.filter(m => /is a PixiJS 7 prop, translated by `compat: "pixi7"`/.test(m))).toHaveLength(
      __DEV__ ? 2 : 0
    );
    expect(messages.filter(m => /PixiJS 6/.test(m))).toHaveLength(0);
  });
});

it("throws on an unknown compat key", () => {
  expect(() => pixi8({ compat: "pixi5" as "pixi6" })).toThrow(/compat.*pixi5.*"pixi6".*"pixi7"/);
});
