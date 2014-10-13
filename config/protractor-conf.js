exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../test/e2e/scenarios.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:4000/#/users/list/page/1',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
