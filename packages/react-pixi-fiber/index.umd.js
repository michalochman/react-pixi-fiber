if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/umd/react-pixi-fiber.production.min.js");
} else {
  module.exports = require("./dist/umd/react-pixi-fiber.development.js");
}
