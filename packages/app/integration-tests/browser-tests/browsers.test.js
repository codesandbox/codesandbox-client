const webdriver = require('selenium-webdriver');

const hash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

function getCapabilities(browserInfo) {
  return {
    ...browserInfo,
    'browserstack.user': process.env.BROWSER_STACK_USER,
    'browserstack.key': process.env.BROWSER_STACK_KEY,
    'browserstack.local': 'true',
    'browserstack.debug': 'true',
    'browserstack.console': 'errors',
    'browserstack.networkLogs': true,
    build: hash,
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

const usedDescribe = process.env.BROWSER_STACK_KEY ? describe : describe.skip;
usedDescribe('browser-tests', () => {
  test(
    'ie11',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'IE',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10',
        resolution: '1024x768',
      };

      await testPageWitCapabilities(capabilities);
    },
    130000
  );

  test.skip(
    'ios',
    async () => {
      // Input capabilities
      const capabilities = {
        browserName: 'iPhone',
        device: 'iPhone SE',
        realMobile: 'true',
        os_version: '11.2',
      };

      await testPageWitCapabilities(capabilities);
    },
    130000
  );

  test(
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
    130000
  );

  test(
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
    130000
  );

  test(
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
    130000
  );
});
