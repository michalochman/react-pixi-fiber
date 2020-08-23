if (process.env.NODE_ENV === "production") {
  module.exports = require("./es/react-pixi-fiber.production.min.js");
} else {
  module.exports = require("./es/react-pixi-fiber.development.js");
}
