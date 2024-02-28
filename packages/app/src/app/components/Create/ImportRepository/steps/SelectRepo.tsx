import React, { useEffect, useMemo, useState } from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import { Input, SkeletonText, Stack, Text } from '@codesandbox/components';

import { useAppState } from 'app/overmind';

import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { useGitHubAccountRepositories } from 'app/hooks/useGitHubAccountRepositories';
import styled from 'styled-components';
import { GithubRepoToImport } from '../../utils/types';
import { AccountSelect } from '../components/AccountSelect';
import { RepoListItem } from '../components/RepoListItem';
import { UnstyledButtonLink } from '../../elements';

type SelectRepoProps = {
  onSelected: (repo: GithubRepoToImport) => void;
  onFindByURLClicked: () => void;
};
export const SelectRepo: React.FC<SelectRepoProps> = ({
  onSelected,
  onFindByURLClicked,
}) => {
  const { activeTeamInfo } = useAppState();

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const githubAccounts = useGithubAccounts();

  const selectOptions = useMemo(
    () =>
      githubAccounts.data && githubAccounts.data.personal
        ? [
            githubAccounts.data.personal,
            ...(githubAccounts.data.organizations || []),
          ]
        : undefined,
    [githubAccounts.data]
  );

  useEffect(() => {
    // Set initially selected account bazed on fuzzy matching
    if (
      githubAccounts.state === 'ready' &&
      // Adding selectOptions to this if statement to satisfy TypeScript, because it does not
      // know that when githubAccounts.state !== 'ready' the fuzzy functions isn't executed.
      selectOptions &&
      activeTeamInfo?.name &&
      selectedAccount === undefined
    ) {
      const match = fuzzyMatchGithubToCsb(activeTeamInfo.name, selectOptions);

      setSelectedAccount(match.login);
    }
  }, [githubAccounts.state, selectedAccount, activeTeamInfo, selectOptions]);

  // eslint-disable-next-line no-nested-ternary
  const selectedAccountType = selectedAccount
    ? selectedAccount === githubAccounts?.data?.personal?.login
      ? 'personal'
      : 'organization'
    : undefined;

  const githubRepos = useGitHubAccountRepositories({
    name: selectedAccount,
    accountType: selectedAccountType,
    teamRepos: [],
  });

  const [queryString, setQueryString] = React.useState<string>('');

  const resultsListLoading = githubRepos.state === 'loading';
  const filteredResults =
    githubRepos.state === 'ready'
      ? githubRepos.data.filter(r =>
          r.name.toLowerCase().includes(queryString.toLowerCase())
        )
      : null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const parsedInput = getOwnerAndNameFromInput(value);

    setQueryString(event.target.value);
  };

  const hasResults = filteredResults && filteredResults.length > 0;
  const noResults = filteredResults && filteredResults.length === 0;

  return (
    <Stack direction="vertical" gap={4}>
      <Text size={3}>Import from your GitHub organizations</Text>
      <Stack gap={1} align="center">
        {selectOptions ? (
          <AccountSelect
            options={selectOptions}
            value={selectedAccount}
            onChange={(account: string) => {
              track('Import repo - Select - Change GH Org');

              setSelectedAccount(account);
            }}
          />
        ) : (
          <SkeletonText css={{ height: '32px', width: '100px' }} />
        )}

        <Text color="#e5e5e5">/</Text>

        <Input
          css={{ height: '32px' }}
          autoFocus
          placeholder="Search by name"
          type="text"
          onChange={handleInputChange}
          required
        />
      </Stack>

      {resultsListLoading && (
        <StyledList direction="vertical" gap={1}>
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
          <SkeletonText css={{ height: '48px', width: '100%' }} />
        </StyledList>
      )}

      {hasResults && (
        <StyledList as="ul" direction="vertical" gap={1}>
          {filteredResults.map(repo => (
            <RepoListItem
              repo={repo}
              onClicked={() => {
                onSelected(repo);
              }}
            />
          ))}
        </StyledList>
      )}

      {noResults && (
        <Text size={3}>
          No repository matching the search. Please double check the repository
          name or try the{' '}
          <UnstyledButtonLink
            css={{ color: 'inherit', textDecoration: 'underline' }}
            onClick={onFindByURLClicked}
          >
            Find by URL
          </UnstyledButtonLink>{' '}
          option.
        </Text>
      )}
    </Stack>
  );
};

const StyledList = styled(Stack)`
  margin: 0;
  padding: 0;
  list-style: none;
`;
