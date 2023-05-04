const puppeteer = require('puppeteer');

function pageLoaded(page) {
  return new Promise(resolve => {
    page.exposeFunction('__puppeteer__', () => {
      if (resolve) {
        resolve();
      }
    });
  });
}

let browser = puppeteer.launch({ headless: true });
const SANDBOX_ID = process.argv[2];
const prod = process.argv[4] === '--prod';
const results = [];

(async function () {
  const url = prod
    ? `https://${SANDBOX_ID}.csb.app`
    : 'http://localhost:3000/#' + SANDBOX_ID;
  browser = await browser;
  console.log('Testing speed of ' + SANDBOX_ID);
  console.log('url: ' + url);

  for (let i = 0; i < (process.argv[3] || 10); i++) {
    const page = await browser.newPage();
    const waitFunction = pageLoaded(page);
    page.goto(url);
    const a = Date.now();
    await waitFunction;
    const d = Date.now() - a;
    results.push(d);
    console.log('Run #' + i + ': ' + d);
    page.close();
  }

  console.log('Results', results.reduce((p, n) => p + n, 0) / results.length);
  process.exit(0);
})();
