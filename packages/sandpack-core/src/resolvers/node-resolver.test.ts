import path from 'path';

import { setupTestFS } from './test-utils';
import { NodeResolver } from './node-resolver';
import { DEFAULT_EXTENSIONS } from '../utils/extensions';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const EXTENSIONS = DEFAULT_EXTENSIONS.map(e => '.' + e);

describe('Node Resolver', () => {
  it('Can resolve some basic files and node_modules properly', async () => {
    const fs = await setupTestFS(path.join(FIXTURES_DIR, 'basic-project'));
    const resolver = new NodeResolver({ fs });

    expect(
      await resolver.resolve({
        filename: '.',
        parent: '/',
        extensions: EXTENSIONS,
      })
    ).toStrictEqual({
      filepath: '/src/browser.js',
      isDependency: false,
    });

    expect(
      await resolver.resolve({
        filename: '@org/pkg-a',
        parent: '/src/main.js',
        extensions: EXTENSIONS,
      })
    ).toStrictEqual({
      filepath: '/node_modules/@org/pkg-a/index.js',
      isDependency: true,
    });

    expect(
      await resolver.resolve({
        filename: 'pkg-b',
        parent: '/src/browser.js',
        extensions: EXTENSIONS,
      })
    ).toStrictEqual({
      filepath: '/node_modules/pkg-b/index.jsx',
      isDependency: true,
    });
  });
});
