import { getESModuleUrl } from './esmodule-url';

describe('ESModule URL', () => {
  it('is ESModule url', () => {
    expect(getESModuleUrl('/', 'https://csb.cdn.io/test.js')).toBe(
      'https://csb.cdn.io/test.js'
    );
    expect(
      getESModuleUrl(
        'https://csb.cdn.io/test.js?esm=true&hmr=0&mtime=1000',
        '/components/Button.tsx'
      )
    ).toBe('https://csb.cdn.io/components/Button.tsx');
    expect(
      getESModuleUrl(
        'https://modules.framer.com/ar78ggiub-aweroiga.js',
        './components/Button.tsx'
      )
    ).toBe('https://modules.framer.com/components/Button.tsx');
    expect(
      getESModuleUrl(
        'https://modules.framer.com/sub-dir/ar78ggiub-aweroiga.js',
        './components/Button.tsx'
      )
    ).toBe('https://modules.framer.com/sub-dir/components/Button.tsx');
    expect(
      getESModuleUrl(
        'https://modules.framer.com/sub-dir/ar78ggiub-aweroiga.js',
        '/node_modules/csbbust/refresh-helper.js'
      )
    ).toBe(null);
    expect(
      getESModuleUrl(
        'https://modules.framer.com/sub-dir/ar78ggiub-aweroiga.js',
        'react'
      )
    ).toBe(null);
  });
});
