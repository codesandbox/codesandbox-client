import { getOwnerAndRepoFromInput } from './utils';

const VALID_REPOS = [
  'github.com/owner/repo',
  'http://github.com/owner/repo',
  'http://www.github.com/owner/repo',
  'https://github.com/owner/repo',
  'https://github.com/owner/repo/',
  'https://www.github.com/owner/repo',
  'www.github.com/owner/repo',
  'https://github.com/owner/repo.git',
  'git@github.com:owner/repo.git',
  'owner/repo',
];

const INVALID_REPOS = [
  'github.com/',
  'github.com/user/',
  'github.com/user/repo/path/to/file',
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

  test('owner/repo-dash returns an owner and repo', () => {
    expect(getOwnerAndRepoFromInput('owner/repo-dash')).toEqual({
      owner: 'owner',
      repo: 'repo-dash',
    });
  });

  test('owner/repo.dot returns an owner and repo', () => {
    expect(getOwnerAndRepoFromInput('owner/repo.dot')).toEqual({
      owner: 'owner',
      repo: 'repo.dot',
    });
  });

  test('https://github.com/owner/repo.com returns an owner and repo', () => {
    expect(
      getOwnerAndRepoFromInput('https://github.com/owner/repo.com')
    ).toEqual({
      owner: 'owner',
      repo: 'repo.com',
    });
  });

  test('https://github.com/owner/repo-dash returns an owner and repo', () => {
    expect(
      getOwnerAndRepoFromInput('https://github.com/owner/repo-dash')
    ).toEqual({
      owner: 'owner',
      repo: 'repo-dash',
    });
  });

  INVALID_REPOS.forEach(possibleRepo => {
    test(`${possibleRepo} returns null`, () => {
      expect(getOwnerAndRepoFromInput(possibleRepo)).toBeNull();
    });
  });

  test('owner/repo/branch returns null', () => {
    expect(getOwnerAndRepoFromInput('owner/repo/branch')).toBeNull();
  });
});
