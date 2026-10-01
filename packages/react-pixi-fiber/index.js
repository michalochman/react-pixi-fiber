if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/react-pixi-fiber.production.min.js");
} else {
  module.exports = require("./dist/cjs/react-pixi-fiber.development.js");
}
