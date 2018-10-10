const puppeteer = require('puppeteer');

function pageLoaded(page) {
  return new Promise(async resolve => {
    await page.exposeFunction('__puppeteer__', () => {
      if (resolve) {
        resolve();
      }
    });
  });
}

let browser = puppeteer.launch();
const SANDBOX_ID = process.argv[2];
const results = [];

(async function() {
  browser = await browser;
  console.log('Testing speed of ' + SANDBOX_ID);

  for (let i = 0; i < (process.argv[3] || 10); i++) {
    const page = await browser.newPage();
    const waitFunction = pageLoaded(page);

    page.goto('http://localhost:3002/#' + SANDBOX_ID);
    const a = Date.now();
    await waitFunction;
    const d = Date.now() - a;
    results.push(d);
    console.log('Run #' + i + ': ' + d);
    page.close();
  }

  console.log('Results', results.reduce((p, n) => p + n, 0) / results.length);
})();
