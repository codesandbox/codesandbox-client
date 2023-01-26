import { getOwnerAndRepoFromInput } from './utils';

const VALID_REPOS = [
  'github.com/owner/repo',
  'http://github.com/owner/repo',
  'http://www.github.com/owner/repo',
  'https://github.com/owner/repo',
  'https://www.github.com/owner/repo',
  'www.github.com/owner/repo',
  'https://github.com/owner/repo.git',
  'git@github.com:owner/repo.git',
  'owner/repo',
];

const INVALID_REPOS = [
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

describe('getOwnerAndRepoFromInput', () => {
  VALID_REPOS.forEach(possibleRepo => {
    test(`${possibleRepo} returns an owner and repo`, () => {
      expect(getOwnerAndRepoFromInput(possibleRepo)).toEqual({
        owner: 'owner',
        repo: 'repo',
      });
    });
  });

  INVALID_REPOS.forEach(possibleRepo => {
    test(`${possibleRepo} returns null`, () => {
      expect(getOwnerAndRepoFromInput(possibleRepo)).toBeNull();
    });
  });
});
