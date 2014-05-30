exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../test/e2e/scenarios_test2.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:4000/development/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
