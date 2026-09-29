if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/cjs/react-18.production.min.js");
} else {
  module.exports = require("./dist/cjs/react-18.development.js");
}
