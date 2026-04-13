const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    env: {
      API_URL: 'http://localhost:3000'
    },
    setupNodeEvents(on, config) {
      config.baseUrl = config.env.API_URL || 'http://localhost:3000';
      return config;
    }
  },
  video: false,
  screenshotOnRunFailure: true,
  requestTimeout: 10000,
  responseTimeout: 10000
});