import json from "rollup-plugin-json";
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const globals = require("rollup-plugin-node-globals");
const replace = require("rollup-plugin-replace");
const resolve = require("rollup-plugin-node-resolve");
const uglify = require("rollup-plugin-uglify");

const NODE_ENV = process.env.NODE_ENV || "production";
const isProduction = NODE_ENV === "production";

const outputFile = isProduction ? "cjs/react-pixi-fiber.production.min.js" : "cjs/react-pixi-fiber.development.js";

const plugins = [
  json({
    preferConst: true,
    indent: "  ",
  }),
  resolve({
    browser: true,
    jsnext: true,
    main: true,
  }),
  babel({
    exclude: "node_modules/**",
  }),
  replace({
    __DEV__: isProduction ? "false" : "true",
    "process.env.NODE_ENV": isProduction ? "'production'" : "'development'",
  }),
  commonjs({
    ignoreGlobal: false,
    include: [
      "node_modules/fbjs/**",
      "node_modules/object-assign/**",
      "node_modules/performance-now/**",
      "node_modules/prop-types/**",
      "node_modules/react/**",
      "node_modules/react-dom/**",
      "node_modules/react-reconciler/**",
    ],
  }),
  globals(),
  isProduction && uglify(),
];

module.exports = {
  input: "src/index.js",
  output: {
    file: outputFile,
    name: "ReactPixiFiber",
    exports: "named",
    format: "cjs",
  },
  plugins: plugins,
  external: ["pixi.js", "react", "react-dom"],
};
