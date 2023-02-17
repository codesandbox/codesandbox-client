import { OrganizationFragment, ProfileFragment } from 'app/graphql/types';
import { findBestMatch } from 'string-similarity';

// Will match: git@github.com:owner/repository.git
const REGEX_SSH = /git@github\.com:(?<owner>[\w-]+)\/(?<repo>[\w-]+)\.git$/i;
// Will match: http(s)://github.com/owner/repo(.git)
const REGEX_HTTPS = /http(s?):\/\/github\.com\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)(\.git)?$/i;
// Will match: www.github.com/owner/repo and github.com/owner/repo
const REGEX_PROTOCOLLESS = /(www\.)?github\.com\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)$/i;
// Will match: owner/repo
const REGEX_PLAIN = /(?<owner>[\w-]+)\/(?<repo>[\w-]+)$/i;

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

export const fuzzyMatchGithubToCsb = (
  teamName: string,
  accounts: Array<ProfileFragment | OrganizationFragment>
) => {
  const match = findBestMatch(
    teamName,
    accounts.map(account => account.login)
  );
  return (
    accounts.find(account => account.login === match.bestMatch.target) ||
    accounts[0] // fallback to profile
  );
};

export const getEventName = (
  isEligibleForTrial: boolean,
  isTeamAdmin?: boolean
): string => {
  if (isTeamAdmin) {
    return isEligibleForTrial
      ? 'Limit banner: import - Start Trial'
      : 'Limit banner: import - Upgrade';
  }

  return 'Limit banner: import - Learn more';
};
