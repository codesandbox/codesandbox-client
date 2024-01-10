import fs from 'fs';
import path from 'path';

import { processPackageJSON } from './pkg-json';

const FIXTURE_PATH = path.join(__dirname, '../fixture');

describe('process package.json', () => {
  it('Should correctly process pkg.exports from @babel/runtime', () => {
    const content = JSON.parse(
      fs.readFileSync(
        path.join(FIXTURE_PATH, 'node_modules/@babel/runtime/package.json'),
        'utf-8'
      )
    );
    const processedPkg = processPackageJSON(
      content,
      '/node_modules/@babel/runtime'
    );
    expect(processedPkg).toMatchSnapshot();
  });

  it('Should correctly handle nested pkg#exports fields (solid-js)', () => {
    const content = JSON.parse(
      fs.readFileSync(
        path.join(FIXTURE_PATH, 'node_modules/solid-js/package.json'),
        'utf-8'
      )
    );
    const processedPkg = processPackageJSON(content, '/node_modules/solid-js');
    expect(processedPkg).toMatchSnapshot();
  });

  it('Should correctly handle root pkg.json', () => {
    const content = JSON.parse(
      fs.readFileSync(path.join(FIXTURE_PATH, 'package.json'), 'utf-8')
    );
    const processedPkg = processPackageJSON(content, '/');
    expect(processedPkg).toMatchSnapshot();
  });
});
