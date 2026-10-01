if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/react-pixi-alias.production.min.js");
} else {
  module.exports = require("./dist/cjs/react-pixi-alias.development.js");
}
