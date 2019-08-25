const pkg = require("../../package.json");
const PIXI = require("pixi.js");

global.__PACKAGE_NAME__ = pkg.name;
global.__PACKAGE_VERSION__ = pkg.version;
global.PIXI = PIXI;
