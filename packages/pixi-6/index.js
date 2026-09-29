if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/pixi-6.production.min.js");
} else {
  module.exports = require("./dist/cjs/pixi-6.development.js");
}
