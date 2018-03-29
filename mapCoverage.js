// Based on: https://github.com/facebook/jest/issues/2418#issuecomment-276056758
const createReporter = require("istanbul-api").createReporter;
const istanbulCoverage = require("istanbul-lib-coverage");

const map = istanbulCoverage.createCoverageMap();
const reporter = createReporter();

const envs = ["dev", "prod"];

envs.forEach(env => {
  const coverage = require(`./coverage/${env}/coverage-final.json`);
  Object.keys(coverage).forEach(filename => map.addFileCoverage(coverage[filename]));
});

reporter.addAll(["json", "lcov", "text-summary"]);
reporter.write(map);
