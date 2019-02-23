module.exports = function(wallaby) {
  return {
    files: ["src/**/*.js", "package.json", "./config/jest/**/*.js"],
    tests: ["test/**/*.js"],
    compilers: {
      "**/*.js": wallaby.compilers.babel(),
    },
    env: {
      type: "node",
    },
    // https://wallabyjs.com/docs/integration/jest.html
    testFramework: "jest",
  };
};
