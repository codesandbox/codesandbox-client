import puppeteer from 'puppeteer';

const SECOND = 1000;
const SANDBOXES = [
  'new',
  // 'preact',
  'vue',
  'svelte',
  'react-ts',
  { id: 'reduxjs-redux-examples-todomvc', threshold: 0.04 },
  'vVoQVk78',
  'faceyspacey-redux-first-router-codesandbox',
  'mZRjw05yp',
  'o29j95wx9',
  'k3q1zjjml5',
  'reduxjs-redux-examples-real-world',
  'CompuIves-codesandbox-presentation',
  'lp5rjr0z4z',
  'nOymMxyY',
  'y26rj99yov', // react transition
  // '6w66jzw3mn', // material-design & preact
  '4j7m47vlm4', // material-ui
  'cssinjs-egghead-templates-and-variables', // postcss egghead
  'xp5qy8r93q', // babel example
  'angular', // angular template
  // Sass importing
  '2ppkvzx570', // nested imports
  'rl2m3xklyo', // node_modules import
  'vanilla',
  //
  'n5wy74w8vl', // material-ui generated demo
  'algolia-doc-onboarding-demos-angular-media', // algolia angular demo
  { id: 'ymjwwrw2rj', threshold: 0.05 }, // empty path
  { id: '98o3k45m8p', threshold: 0.05 }, // direct path test
  'pm79km5lmj', // babel macros with styled components
  'j2wpjwqj93', // sandbox with need of transpiling in node_modules
  '1oknw8q8zq', // Parcel with async function (no regeneratorRuntime error)
  '31kn7voz4q', // cxjs
  'zw9zjy0683', // aurelia
  'zx22owojr3', // vue v-slot test
  // '4888omqqz7', // material-ui https://github.com/codesandbox/codesandbox-client/issues/1741,
  'sebn6', // babel plugin dynamically downloaded
  'utmms', // babel plugin pragmatic-jsx which requires other babel plugin
];
const SANDBOXES_REPO = 'codesandbox/integration-sandboxes';

// Logic for parallelizing the tests
const PARALLEL_NODES = Number.parseInt(process.env.CIRCLE_NODE_TOTAL, 10) || 1;
const PARALLEL_INDEX = Number.parseInt(process.env.CIRCLE_NODE_INDEX, 10) || 0;

const batchSize = Math.floor(SANDBOXES.length / PARALLEL_NODES);
const sandboxesToTest = SANDBOXES.slice(
  batchSize * PARALLEL_INDEX,
  batchSize * (PARALLEL_INDEX + 1)
);

function pageLoaded(page) {
  return new Promise(resolve =>
    page.exposeFunction('__puppeteer__', () => {
      if (resolve) {
        resolve();
      }
    })
  );
}

function sandboxUrl(sandboxId) {
  return `http://localhost:3000/#github/${SANDBOXES_REPO}/tree/master/${sandboxId}`;
}

function loadSandbox(page, sandboxId, timeout) {
  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(async () => {
      reject(
        Error(
          `Timeout: loading sandbox '${sandboxId}' took more than ${timeout /
            SECOND}s`
        )
      );
    }, timeout);
    page.goto(sandboxUrl(sandboxId), {
      timeout: 0, // we manage the timeout ourselves
    });
    page.on('console', msg => {
      for (let i = 0; i < msg.args().length; ++i) {
        console.log(`${i}: ${msg.args()[i]}`); // eslint-disable-line
      }
    });
    page.on('error', msg => {
      console.log('error', msg); // eslint-disable-line
    });
    await pageLoaded(page);
    clearTimeout(timer);
    await page.waitFor(2 * SECOND);
    resolve();
  });
}

// eslint-disable-next-line consistent-return
async function loadSandboxRetry(browser, sandboxId, timeout, retries) {
  let page;
  for (let i = 1; i <= retries; i++) {
    try {
      const start = new Date();
      /* eslint-disable no-await-in-loop */
      page = await browser.newPage();
      await loadSandbox(page, sandboxId, timeout);
      process.stdout.write(
        `Sandbox '${sandboxId}' loaded in ${(new Date() - start) / SECOND}s\n`
      );
      return page;
    } catch (err) {
      await page.waitFor(SECOND);
      await page.close();
      /* eslint-enable no-await-in-loop */
      if (i === retries) {
        throw new Error(`${err.message}, retried ${retries} times.`);
      } else {
        process.stdout.write(`Loading sandbox '${sandboxId}', retry ${i}...\n`);
      }
    }
  }
}

describe('sandboxes', () => {
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  afterAll(() => {
    browser.close();
  });

  sandboxesToTest.forEach(sandbox => {
    const id = sandbox.id || sandbox;
    const threshold = sandbox.threshold || 0.01;

    it(
      `loads the sandbox '${id}'`,
      async () => {
        browser = await browser;

        const page = await loadSandboxRetry(browser, id, 45 * SECOND, 2);

        const screenshot = await page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold,
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });

        await page.close();
      },
      65 * SECOND
    );
  });
});
