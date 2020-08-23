const pkg = require("../package.json");
const { babel } = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const visualizer = require("rollup-plugin-visualizer");

const NODE_ENV = process.env.NODE_ENV || "production";
const isProduction = NODE_ENV === "production";

const getOutputFile = (name, format = "cjs") => {
  const suffix = isProduction ? "production.min" : "development";
  return `${format}/${name}.${suffix}.js`;
};

const getPlugins = entry => [
  nodeResolve({
    mainFields: ["module", "jsnext:main", "main"],
  }),
  babel({
    exclude: "node_modules/**",
  }),
  replace({
    __DEV__: isProduction ? JSON.stringify(false) : JSON.stringify(true),
    __PACKAGE_NAME__: JSON.stringify(pkg.name),
    "process.env.NODE_ENV": isProduction ? JSON.stringify("production") : JSON.stringify("development"),
  }),
  commonjs(),
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
    external: ["pixi.js", "prop-types", "react", "react-dom", "scheduler"],
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
    external: ["pixi.js", "prop-types", "react", "react-dom", "react-pixi-fiber", "scheduler"],
  },
  {
    input: "src/index.js",
    output: {
      file: getOutputFile("react-pixi-fiber", "umd"),
      name: "ReactPixiFiber",
      exports: "named",
      format: "umd",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "prop-types": "PropTypes",
        "pixi.js": "PIXI",
        scheduler: "Scheduler",
      },
    },
    plugins: getPlugins("index"),
    external: ["pixi.js", "prop-types", "react", "react-dom", "scheduler"],
  },
  {
    input: "src/react-pixi-alias/index.js",
    output: {
      file: getOutputFile("react-pixi-alias", "umd"),
      name: "ReactPixiFiber",
      exports: "named",
      format: "umd",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "prop-types": "PropTypes",
        "pixi.js": "PIXI",
        "react-pixi-fiber": "ReactPixiFiber",
        scheduler: "Scheduler",
      },
    },
    plugins: getPlugins("alias"),
    external: ["pixi.js", "prop-types", "react", "react-dom", "react-pixi-fiber", "scheduler"],
  },
];
