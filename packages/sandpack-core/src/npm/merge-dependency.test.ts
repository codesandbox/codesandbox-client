import fs from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';
import { mergeDependencies, ILambdaResponse } from './merge-dependency';

// This reads packages from cache and re-downloads if not found
async function getFixture(
  dep: string,
  version: string
): Promise<ILambdaResponse> {
  const fixtureDirName = path.join(
    __dirname,
    'fixtures/packages-cache',
    dep,
    `${version}.json`
  );
  try {
    const foundFile = await fs.readFile(fixtureDirName, 'utf-8');
    return JSON.parse(foundFile);
  } catch (err) {
    const result = await fetch(
      `https://prod-packager-packages.codesandbox.io/v2/packages/${dep}/${version}.json`
    );
    const downloaded = await result.json();
    await fs.outputFile(fixtureDirName, JSON.stringify(downloaded));
    return downloaded;
  }
}

it('can merge 2 responses', async () => {
  const react = await getFixture('react', '17.0.2');
  const reactDom = await getFixture('react-dom', '17.0.2');
  const mergedDependencies = mergeDependencies([react, reactDom]);
  expect(mergedDependencies).toMatchSnapshot();
});

it('conflicting versions dnd-kit', async () => {
  const dndKitCore = await getFixture('@dnd-kit/core', '3.0.1');
  const dndKitSortable = await getFixture('@dnd-kit/sortable', '3.0.1');
  const dndKitUtilities = await getFixture('@dnd-kit/utilities', '2.0.0');

  const mergedDependencies = mergeDependencies([
    dndKitCore,
    dndKitSortable,
    dndKitUtilities,
  ]);
  const parsedPkg = JSON.parse(
    mergedDependencies.contents['/node_modules/@dnd-kit/core/package.json']
      .content
  );

  expect(parsedPkg.version).toBe('3.0.1');
  expect(mergedDependencies).toMatchSnapshot();
});

it('Similarly named packages and pathnames', async () => {
  const utilPkg = await getFixture('util', '0.11.1');
  const utilDeprecatePkg = await getFixture('util-deprecate', '1.0.2');
  const readableStreamPkg = await getFixture('readable-stream', '2.3.7');
  const nodeLibsBrowserPkg = await getFixture('node-libs-browser', '2.2.1');

  const mergedDependencies = mergeDependencies([
    utilPkg,
    utilDeprecatePkg,
    nodeLibsBrowserPkg,
    readableStreamPkg,
  ]);

  expect(
    mergedDependencies.contents['/node_modules/util-deprecate/browser.js']
  ).toBeTruthy();
  expect(
    mergedDependencies.contents['/node_modules/util/support/isBufferBrowser.js']
  ).toBeTruthy();

  expect(mergedDependencies).toMatchSnapshot();
});

it('Should not remap sub-dependencies if they are already in a sub-folder', async () => {
  const babelCorePkg = await getFixture('@babel/core', '7.6.4');
  const babelPresetEnvPkg = await getFixture('@babel/preset-env', '7.6.3');
  const babelStandalonePkg = await getFixture('@babel/standalone', '7.6.4');

  const mergedDependencies = mergeDependencies([
    babelCorePkg,
    babelPresetEnvPkg,
    babelStandalonePkg,
  ]);

  // Transient dependency
  expect(
    JSON.parse(
      mergedDependencies.contents['/node_modules/semver/package.json'].content
    ).version
  ).toBe('5.7.1');

  // Transient dep of transient dep... Yarn made this sub-folder so we just keep it...
  expect(
    JSON.parse(
      mergedDependencies.contents[
        '/node_modules/core-js-compat/node_modules/semver/package.json'
      ].content
    ).version
  ).toBe('7.0.0');

  expect(mergedDependencies).toMatchSnapshot();
});
