import { OrganizationFragment, ProfileFragment } from 'app/graphql/types';
import { findBestMatch } from 'string-similarity';

export const fuzzyMatchGithubToCsb = (
  teamName: string,
  accounts: Array<ProfileFragment | OrganizationFragment>
) => {
  const match = findBestMatch(
    teamName,
    accounts.map(account => account.login).filter(Boolean)
  );

  const bestMatch = accounts.find(
    account => account.login === match.bestMatch.target
  );

  if (bestMatch) {
    return bestMatch;
  }

  return accounts[0];
};
