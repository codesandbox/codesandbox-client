const webdriver = require('selenium-webdriver');

function getCapabilities(browserInfo) {
  return {
    ...browserInfo,
    'browserstack.user': process.env.BROWSER_STACK_USER,
    'browserstack.key': process.env.BROWSER_STACK_KEY,
    'browserstack.local': 'true',
  };
}

function getDriver(capabilities) {
  return new webdriver.Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build();
}

function testPageWitCapabilities(capabilities) {
  const driver = getDriver(getCapabilities(capabilities));
  // Test if a sandbox can be loaded on IE11
  return driver.get('http://localhost:3002/#new').then(async () => {
    const element = webdriver.By.css('h1');
    await driver.wait(webdriver.until.elementLocated(element), 60000);
    driver.quit();
  });
}

describe('browser-tests', () => {
  test.concurrent(
    'ie11',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'IE',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10',
        resolution: '1280x1024',
      };

      await testPageWitCapabilities(capabilities);
    },
    65000
  );

  test.concurrent(
    'ios',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'iPhone',
        platform: 'MAC',
        device: 'iPhone 5S',
      };

      await testPageWitCapabilities(capabilities);
    },
    65000
  );

  test.concurrent(
    'firefox',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'Firefox',
        browser_version: '58.0',
        os: 'Windows',
        os_version: '10',
        resolution: '1024x768',
      };

      await testPageWitCapabilities(capabilities);
    },
    65000
  );

  test.concurrent(
    'safari',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'Safari',
        browser_version: '10.0',
        os: 'OS X',
        os_version: 'Sierra',
        resolution: '1024x768',
      };

      await testPageWitCapabilities(capabilities);
    },
    65000
  );

  test.concurrent(
    'android',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'android',
        device: 'Samsung Galaxy S8',
        realMobile: 'true',
        os_version: '7.0',
      };

      await testPageWitCapabilities(capabilities);
    },
    65000
  );
});
