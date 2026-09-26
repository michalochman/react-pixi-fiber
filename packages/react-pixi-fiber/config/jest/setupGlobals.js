const pkg = require("../../package.json");
const PIXI = require("pixi.js");

global.__PACKAGE_NAME__ = pkg.name;

global.PIXI = PIXI;
