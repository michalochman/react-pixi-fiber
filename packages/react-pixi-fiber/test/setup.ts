import { beforeAll } from "vitest";

// Configures the core suite with react-18 and the in-core builtins. The imports are dynamic and run in beforeAll: a
// setup file's static imports load before a test file's vi.mock calls apply, so those mocks would miss every module
// that configure pulls in. A test file that mocks ../src/configure without `configure` configures nothing here.
beforeAll(async () => {
  const mod = await import("../src/configure");
  if (!("configure" in mod)) return;
  const react18 = (await import("@react-pixi-fiber/react-18")).default;
  const builtins = (await import("../src/builtins")).default;
  mod.configure({ react: react18(), pixi: builtins });
});
