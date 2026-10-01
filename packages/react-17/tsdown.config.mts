import { createTsdownConfig } from "../../scripts/tsdown.config.ts";

export default createTsdownConfig({
  name: "react-17",
  external: ["react"],
  bundle: [/^react-reconciler/],
  tsconfig: "tsconfig.build.json",
});
