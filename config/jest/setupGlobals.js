const pkg = require("../../package.json");

global.__PACKAGE_NAME__ = pkg.name;
global.__PACKAGE_VERSION__ = pkg.version;
