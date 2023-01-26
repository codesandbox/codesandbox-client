import { findBestMatch } from 'string-similarity';
import { State } from './useGithubOrganizations';

// Will match: git@github.com:owner/repository.git
const REGEX_SSH = /git@github\.com:(?<owner>[\w-]+)\/(?<repo>[\w-]+)\.git$/i;
// Will match: http(s)://github.com/owner/repo(.git)
const REGEX_HTTPS = /http(s?):\/\/github\.com\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)(\.git)?$/i;
// Will match: www.github.com/owner/repo and github.com/owner/repo
const REGEX_PROTOCOLLESS = /(www\.)?github\.com\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)$/i;
// Will match: owner/repo
const REGEX_PLAIN = /(?<owner>[\w-]+)\/(?<repo>[\w-]+)$/i;

export const checkRepoInput = (input: string) =>
  [REGEX_SSH, REGEX_HTTPS, REGEX_PROTOCOLLESS, REGEX_PLAIN].some(exp =>
    exp.test(input)
  );

export const getOwnerAndRepoFromInput = (input: string) => {
  const match =
    REGEX_SSH.exec(input) ||
    REGEX_HTTPS.exec(input) ||
    REGEX_PROTOCOLLESS.exec(input) ||
    REGEX_PLAIN.exec(input);

  if (!match) {
    return null;
  }

  const { owner, repo } = match.groups as { owner: string; repo: string };

  return { owner, repo };
};

export const getGihubOrgMatchingCsbTeam = (
  teamName: string,
  orgs: Extract<State, { state: 'ready' }>['data']
) => {
  const match = findBestMatch(
    teamName,
    orgs.map(org => org.login)
  );
  return orgs.find(org => org.login === match.bestMatch.target) || orgs[0];
};
