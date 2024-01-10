import { isTarDependency } from './tar';

describe('tar', () => {
  it('Should be able to detect if a version is a tar file or not', async () => {
    expect(isTarDependency('ssh://something.com/something.tar')).toBe(false);
    expect(isTarDependency('https://something.com/something')).toBe(true);
    expect(isTarDependency('http//something.com')).toBe(false);
    expect(isTarDependency('url-http')).toBe(false);
    expect(isTarDependency('https://npmjs.com/@react/pkg/sub.tgz')).toBe(true);
    expect(isTarDependency('https://npmjs.com/@react/pkg/sub.tar')).toBe(true);
    expect(isTarDependency('https://npmjs.com/@react/pkg/sub')).toBe(true);
    expect(isTarDependency('https://microsoft.com')).toBe(true);
  });
});
