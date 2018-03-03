module.exports = function(wallaby) {
  return {
    files: ["src/**/*.js", "package.json"],
    tests: ["test/**/*.js"],
    compilers: {
      "**/*.js": wallaby.compilers.babel(),
    },
    env: {
      type: "node",
      runner: "node",
    },
    // https://wallabyjs.com/docs/integration/jest.html
    testFramework: "jest",
    // https://medium.com/@artem.govorov/jest-snapshot-testing-on-steroids-with-wallaby-js-a53008f619f0
    // https://github.com/wallabyjs/public/issues/870
  };
};
