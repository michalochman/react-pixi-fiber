const json = require("rollup-plugin-json");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const globals = require("rollup-plugin-node-globals");
const replace = require("rollup-plugin-replace");
const resolve = require("rollup-plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const visualizer = require("rollup-plugin-visualizer");

const NODE_ENV = process.env.NODE_ENV || "production";
const isProduction = NODE_ENV === "production";

const getOutputFile = name => {
  const suffix = isProduction ? "production.min" : "development";
  return `cjs/${name}.${suffix}.js`;
};

const getPlugins = entry => [
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
      "node_modules/scheduler/**",
    ],
  }),
  globals(),
  isProduction && terser(),
  visualizer({
    filename: `./stats.${entry}.${isProduction ? "production" : "development"}.html`,
  }),
];

export default [
  {
    input: "src/index.js",
    output: {
      file: getOutputFile("react-pixi-fiber"),
      name: "ReactPixiFiber",
      exports: "named",
      format: "cjs",
    },
    plugins: getPlugins("index"),
    external: ["pixi.js", "prop-types", "react", "react-dom"],
  },
  {
    input: "src/react-pixi-alias/index.js",
    output: {
      file: getOutputFile("react-pixi-alias"),
      name: "ReactPixiFiber",
      exports: "named",
      format: "cjs",
    },
    plugins: getPlugins("alias"),
    external: ["pixi.js", "prop-types", "react", "react-dom", "react-pixi-fiber"],
  },
];
