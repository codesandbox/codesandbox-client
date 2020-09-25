import fetch from 'fetch-vcr';

// @ts-ignore
window.fetch = fetch;
describe('resolve-dependency', () => {
  const resolveDependencyInfo: typeof import('./resolve-dependency').resolveDependencyInfo = require('./resolve-dependency')
    .resolveDependencyInfo;

  jest.mock('./fetch-protocols/tar', () => ({
    TarFetcher: class A {},
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
