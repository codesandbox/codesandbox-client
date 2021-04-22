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
  const merge = mergeDependencies([react, reactDom]);

  expect(merge).toMatchSnapshot();
});

it('conflicting versions dnd-kit', async () => {
  const dndKitCore = await getFixture('@dnd-kit/core', '3.0.1');
  const dndKitSortable = await getFixture('@dnd-kit/sortable', '3.0.1');
  const dndKitUtilities = await getFixture('@dnd-kit/utilities', '2.0.0');

  const merge = mergeDependencies([
    dndKitCore,
    dndKitSortable,
    dndKitUtilities,
  ]);
  const parsedPkg = JSON.parse(
    merge.contents['/node_modules/@dnd-kit/core/package.json'].content
  );

  expect(parsedPkg.version).toBe('3.0.1');
  expect(merge).toMatchSnapshot();
});
