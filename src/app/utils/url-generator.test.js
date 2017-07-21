import { gitHubToSandboxUrl } from './url-generator';

describe('url-generator', () => {
  describe('gitHubToSandboxUrl', () => {
    [
      'http://github.com/user/repo',
      'http://www.github.com/user/repo',
      'https://github.com/user/repo',
      'https://www.github.com/user/repo',
    ].forEach(inputUrl => {
      test(`handles ${inputUrl} urls`, () => {
        expect(gitHubToSandboxUrl(inputUrl)).toBe('/s/github/user/repo');
      });
    });
  });
});
