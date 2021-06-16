import fetch from 'fetch-vcr';

// @ts-ignore
window.fetch = fetch;

describe.skip('resolve-dependency', () => {
  // eslint-disable-next-line global-require
  const resolveDependencyInfo: typeof import('./resolve-dependency').resolveDependencyInfo = require('./resolve-dependency')
    .resolveDependencyInfo;

  jest.mock('./fetch-protocols/tar', () => ({
    TarFetcher: class A {},
    isTarDependency: () => true,
  }));

  it('marks the original dependency requester as parent on subdependencies', async () => {
    const result = await resolveDependencyInfo(
      'antd',
      'https://pkg.csb.dev/ant-design/ant-design/commit/ad3a0ecb/antd',
      []
    );

    expect(result.dependencyDependencies['@babel/runtime'].parents).toContain(
      'antd'
    );
  });
});
