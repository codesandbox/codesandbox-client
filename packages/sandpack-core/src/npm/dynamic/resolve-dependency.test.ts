import fetch from 'fetch-vcr';

// @ts-ignore
window.fetch = fetch;

// eslint-disable-next-line import/first
import { resolveDependencyInfo } from './resolve-dependency';

describe('resolve-dependency', () => {
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
