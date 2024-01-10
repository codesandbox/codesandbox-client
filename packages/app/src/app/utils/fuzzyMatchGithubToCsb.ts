import { OrganizationFragment, ProfileFragment } from 'app/graphql/types';
import { findBestMatch } from 'string-similarity';
import track from '@codesandbox/common/lib/utils/analytics';

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
    track('Match GH to CSB - success', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    return bestMatch;
  }

  track('Match GH to CSB - fail', {
    codesandbox: 'V1',
    event_source: 'UI',
  });

  return accounts[0];
};
