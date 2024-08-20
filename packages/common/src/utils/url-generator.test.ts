import { sandboxUrl } from '../../lib/utils/url-generator';
import { gitHubRepoPattern, gitHubToSandboxUrl } from './url-generator';

const invalidUrls = [
  'github.com/',
  'github.com/user/',
  'http://github.com/',
  'http://github.com/user/',
  'http://www.github.com/',
  'http://www.github.com/user/',
  'https://github.com/user/',
  'https://www.github.com/user/',
  'www.github.com/',
  'www.github.com/user/',
];

const validUrls = [
  'github.com/user/repo',
  'http://github.com/user/repo',
  'http://www.github.com/user/repo',
  'https://github.com/user/repo',
  'https://www.github.com/user/repo',
  'www.github.com/user/repo',
];

describe('url-generator', () => {
  describe('gitHubToSandboxUrl', () => {
    validUrls.forEach(inputUrl => {
      test(`handles ${inputUrl} urls`, () => {
        expect(gitHubToSandboxUrl(inputUrl)).toBe('/s/github/user/repo');
      });
    });
  });

  describe('gitHubRepoPattern', () => {
    validUrls.forEach(inputUrl => {
      test(`validates ${inputUrl} as truthy`, () => {
        expect(gitHubRepoPattern.test(inputUrl)).toBeTruthy();
      });
    });

    invalidUrls.forEach(inputUrl => {
      test(`validates ${inputUrl} as falsy`, () => {
        expect(gitHubRepoPattern.test(inputUrl)).toBeFalsy();
      });
    });
  });

  describe('sandboxUrl', () => {
    test(`devbox link`, () => {
      expect(sandboxUrl({ id: 'sandbox-id', isV2: true })).toBe(
        '/p/devbox/sandbox-id'
      );
    });

    test(`sandbox link`, () => {
      expect(sandboxUrl({ id: 'sandbox-id' })).toBe('/p/sandbox/sandbox-id');
    });

    test(`handles query params`, () => {
      expect(
        sandboxUrl({ id: 'sandbox-id', isV2: true, query: { welcome: 'true' } })
      ).toBe('/p/devbox/sandbox-id?welcome=true');
    });
  });
});
