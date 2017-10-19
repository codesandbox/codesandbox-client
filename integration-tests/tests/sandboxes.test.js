import puppeteer from 'puppeteer';
import { basename } from 'path';

const SANDBOXES = [
  'new',
  'preact',
  { id: 'vue', root: 'app' },
  'svelte',
  'react-ts',
  'github/reactjs/redux/tree/master/examples/todomvc',
];

SANDBOXES.forEach(sandbox => {
  const id = sandbox.id || sandbox;
  const root = sandbox.root || 'root';
  let browser = puppeteer.launch();

  describe('sandboxes', () => {
    afterAll(() => {
      browser.close();
    });

    it.concurrent(
      `loads the sandbox with id '${id}'`,
      async () => {
        browser = await browser;
        const page = await browser.newPage();
        await page.goto('http://localhost:3001/#' + id);
        await page.waitForSelector('#' + root);
        await page.waitFor(2000);

        // const html = await page.evaluate(() => document.body.innerHTML);
        // expect(html).toMatchSnapshot(id.split('/').join('-'));

        const screenshot = await page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold: 0.03, // 3% threshold
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });
      },
      1000 * 60 * 10 // 10 minutes for all tests in total
    );
  });
});
