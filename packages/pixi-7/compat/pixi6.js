const mod =
  process.env.NODE_ENV === "production"
    ? require("../dist/cjs/compat/pixi6.production.min.js")
    : require("../dist/cjs/compat/pixi6.development.js");

// Node ESM default-imports module.exports, so it has to be the translator itself.
module.exports = mod.default;
module.exports.default = mod.default;
