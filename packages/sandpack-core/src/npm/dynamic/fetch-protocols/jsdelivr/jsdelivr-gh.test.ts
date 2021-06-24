import { isGithubDependency, convertGitHubURLToVersion } from './jsdelivr-gh';

describe('jsdelivr-github fetch protocol', () => {
  it('Should be able to turn github urls to jsdelivr pathnames', async () => {
    expect(
      convertGitHubURLToVersion('git+ssh://git@github.com:npm/cli.git#v1.0.27')
    ).toBe('npm/cli@v1.0.27');
    expect(
      convertGitHubURLToVersion('git+https://isaacs@github.com/npm/cli.git')
    ).toBe('npm/cli');
    expect(
      convertGitHubURLToVersion('git://github.com/npm/cli.git#v1.0.27')
    ).toBe('npm/cli@v1.0.27');
    expect(convertGitHubURLToVersion('goranurukalo/redux-injectors#dev')).toBe(
      'goranurukalo/redux-injectors@dev'
    );
    expect(convertGitHubURLToVersion('goranurukalo/redux-injectors')).toBe(
      'goranurukalo/redux-injectors'
    );
  });

  it('Should be able to detect if a version is a github reference or not', async () => {
    expect(
      isGithubDependency('git+ssh://git@github.com:npm/cli.git#v1.0.27')
    ).toBe(true);
    expect(
      isGithubDependency('git+ssh://git@gitlab.com:npm/cli.git#v1.0.27')
    ).toBe(false);
    expect(isGithubDependency('goranurukalo/redux-injectors#dev')).toBe(true);
    expect(isGithubDependency('goranurukalo/redux-injectors')).toBe(true);
    expect(isGithubDependency('1.2.3')).toBe(false);
    expect(isGithubDependency('npm:test@12.5.4')).toBe(false);
  });
});
