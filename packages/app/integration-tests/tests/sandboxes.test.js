import puppeteer from 'puppeteer';

const SANDBOXES = [
  'new',
  'preact',
  'vue',
  'svelte',
  'react-ts',
  'github/reactjs/redux/tree/master/examples/todomvc',
  { id: 'jvlrl98xw3', threshold: 0.05 },
  'vVoQVk78',
  'github/faceyspacey/redux-first-router-codesandbox/tree/master',
  'mZRjw05yp',
  'pk1qjqpw67',
  'o29j95wx9',
  'k3q1zjjml5',
  'github/reactjs/redux/tree/master/examples/real-world',
  'github/CompuIves/codesandbox-presentation',
  'lp5rjr0z4z',
  'nOymMxyY',
];

SANDBOXES.forEach(sandbox => {
  const id = sandbox.id || sandbox;
  const threshold = sandbox.threshold || 0.01;
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  describe('sandboxes', () => {
    afterAll(() => {
      browser.close();
    });

    it.concurrent(
      `loads the sandbox with id '${id}'`,
      async () => {
        browser = await browser;
        const page = await browser.newPage();
        await page.goto('http://localhost:3001/#' + id, {
          waitUntil: 'networkidle0',
          timeout: 60000,
        });
        await page.waitFor(2000);

        const screenshot = await page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold,
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });
      },
      1000 * 60 * 10 // 10 minutes for all tests in total
    );
  });
});
