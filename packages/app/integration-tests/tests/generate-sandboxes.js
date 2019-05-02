const puppeteer = require('puppeteer');
const { exec } = require('child_process');

const SANDBOXES = ['svelte'];

const cp = exec('yarn start:test');
cp.stdout.on('data', data => {
  console.log(data.toString());
  if (data.toString().includes('Compiled with warnings.')) {
    console.log('CSB: Starting tests');
    runTests();
  }
});

async function runTests() {
  function pageLoaded(page) {
    return new Promise(async resolve => {
      await page.exposeFunction('__puppeteer__', () => {
        if (resolve) {
          resolve();
        }
      });
    });
  }

  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  await Promise.all(
    SANDBOXES.map(async sandbox => {
      const id = sandbox.id || sandbox;

      console.log('Loading browser');
      browser = await browser;
      const page = await browser.newPage();
      console.log('Opened new page');
      const waitFunction = pageLoaded(page);
      console.log('Page loaded');

      page.on('console', msg =>
        msg.args().forEach(async arg => {
          console.log(await arg.jsonValue());
        })
      );
      page.on('requestfailed', err => console.log(err));

      console.log('Going to', 'http://localhost:3002/#' + id);
      await page.goto('http://localhost:3002/#' + id, {
        timeout: 60000,
      });
      console.log('Went to ' + id);

      await waitFunction;
      console.log('Waited');
      await page.waitFor(sandbox.waitFor || 2000);
      console.log('Another wait');

      const screenshot = await page.screenshot();

      require('fs').writeFileSync(
        require('path').join(
          __dirname,
          `__image_snapshots__`,
          `${id.split('/').join('-')}-snap.png`
        ),
        screenshot
      );

      console.log('Saved screenshot');

      await page.close();
    })
  );

  process.kill(0);
}
