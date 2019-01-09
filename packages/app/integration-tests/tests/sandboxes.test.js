import puppeteer from 'puppeteer';

const SANDBOXES = [
  'new',
  // 'preact',
  'vue',
  'svelte',
  'react-ts',
  { id: 'github/reactjs/redux/tree/master/examples/todomvc', threshold: 0.04 },
  'vVoQVk78',
  'github/faceyspacey/redux-first-router-codesandbox/tree/master',
  'mZRjw05yp',
  'o29j95wx9',
  'k3q1zjjml5',
  'github/reactjs/redux/tree/master/examples/real-world',
  'github/CompuIves/codesandbox-presentation',
  'lp5rjr0z4z',
  'nOymMxyY',
  'y26rj99yov', // react transition
  { id: 'X6npLXPRW', threshold: 0.05 }, // react-table
  '6w66jzw3mn', // material-design & preact
  '4j7m47vlm4', // material-ui
  'github/cssinjs/egghead/tree/master/from-sass-to-cssinjs/templates-and-variables', // postcss egghead
  'xp5qy8r93q', // babel example
  'angular', // angular template
  // Sass importing
  '2ppkvzx570', // nested imports
  'rl2m3xklyo', // node_modules import
  'vanilla',
  'n5wy74w8vl', // material-ui generated demo
  'github/algolia/doc-onboarding/tree/master/demos/angular/media', // algolia angular demo
  { id: 'ymjwwrw2rj', threshold: 0.05 }, // empty path
  { id: '98o3k45m8p', threshold: 0.05 }, // direct path test
  'pm79km5lmj', // babel macros with styled components
  'j2wpjwqj93', // sandbox with need of transpiling in node_modules
  '1oknw8q8zq', // Parcel with async function (no regeneratorRuntime error)
  '42n5l3z3xw', // cxjs
];

function pageLoaded(page) {
  return new Promise(async resolve => {
    await page.exposeFunction('__puppeteer__', () => {
      if (resolve) {
        resolve();
      }
    });
  });
}

describe('sandboxes', () => {
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  afterAll(() => {
    browser.close();
  });

  SANDBOXES.forEach(sandbox => {
    const id = sandbox.id || sandbox;
    const threshold = sandbox.threshold || 0.01;

    it(
      `loads the sandbox with id '${id}'`,
      async () => {
        browser = await browser;
        const page = await browser.newPage();
        const waitFunction = pageLoaded(page);
        page.goto('http://localhost:3002/#' + id, {
          timeout: 60000,
        });
        await waitFunction;
        await page.waitFor(sandbox.waitFor || 2000);

        const screenshot = await page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold,
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });

        await page.close();
      },
      1000 * 120 * 1
    );
  });
});
