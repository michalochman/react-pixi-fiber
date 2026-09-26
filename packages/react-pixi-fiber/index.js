if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-pixi-fiber.production.min.js");
} else {
  module.exports = require("./cjs/react-pixi-fiber.development.js");
}
