import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { exec } from 'child_process';

import { loadSandboxRetry, SECOND } from './utils';

const SANDBOXES = [
  'faceyspacey-redux-first-router-codesandbox',
  'mZRjw05yp',
  'ymjwwrw2rj',
  'j2wpjwqj93',
  '31kn7voz4q',
  'zx22owojr3',
];

async function runTests() {
  console.log('Launching puppeteer');
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('Loading browser');
  browser = await browser;

  await Promise.all(
    SANDBOXES.map(async sandbox => {
      const id = sandbox.id || sandbox;

      console.log(`Loading sandbox ${id}`);
      const page = await loadSandboxRetry(browser, id, 45 * SECOND, 2);
      console.log('Page loaded');

      console.log('Taking screenshot');
      const screenshot = await page.screenshot();
      const screenshotFilePath = path.join(
        __dirname,
        `__image_snapshots__`,
        `${id.split('/').join('-')}-snap.png`
      );

      fs.writeFileSync(screenshotFilePath, screenshot);

      console.log('Saved screenshot');

      await page.close();
    })
  );

  browser.close();
  process.exit(0);
}

console.log('Starting sandbox server');
const cp = exec('yarn start:test');
cp.stdout.on('data', data => {
  const dataString = data.toString();
  if (
    dataString.includes('Compiled with warnings.') ||
    dataString.includes('Compiled successfully in')
  ) {
    console.log('CSB: Starting tests');
    runTests();
  }
});

cp.stderr.on('data', data => {
  const dataString = data.toString();
  console.error(dataString);
});
