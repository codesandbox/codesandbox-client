import React, { useEffect, useState } from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import { Input, SkeletonText, Stack, Text } from '@codesandbox/components';

import { useAppState } from 'app/overmind';

import { GithubAccounts } from 'app/hooks/useGithubOrganizations';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import styled from 'styled-components';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { GithubRepoToImport } from '../../utils/types';
import { AccountSelect } from '../components/AccountSelect';
import { RepoListItem } from '../components/RepoListItem';
import { UnstyledButtonLink } from '../../elements';
import { getOwnerAndNameFromInput } from '../utils';
import { useGithubRepos } from '../../hooks/useGithubRepos';

type SearchInOrganizationsProps = {
  githubAccounts: GithubAccounts;
  onSelected: (repo: Omit<GithubRepoToImport, 'appInstalled'>) => void;
  onFindByURLClicked: () => void;
};
export const SearchInOrganizations: React.FC<SearchInOrganizationsProps> = ({
  githubAccounts,
  onSelected,
  onFindByURLClicked,
}) => {
  const { activeTeamInfo, sidebar, activeTeam } = useAppState();

  const workspaceRepos = sidebar[activeTeam]?.repositories || [];

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();

  useEffect(() => {
    // Set initially selected account bazed on fuzzy matching
    if (
      githubAccounts.state === 'ready' &&
      activeTeamInfo?.name &&
      selectedAccount === undefined
    ) {
      const match = fuzzyMatchGithubToCsb(
        activeTeamInfo.name,
        githubAccounts.all
      );
      setSelectedAccount(match.login);
    }
  }, [githubAccounts, selectedAccount, activeTeamInfo]);

  const selectedAccountType =
    // eslint-disable-next-line no-nested-ternary
    githubAccounts.state === 'ready' && selectedAccount
      ? selectedAccount === githubAccounts.personal.login
        ? 'personal'
        : 'organization'
      : undefined;

  const githubRepos = useGithubRepos(selectedAccount, selectedAccountType);

  const [queryString, setQueryString] = React.useState<string>('');

  const resultsListLoading = githubRepos.state === 'loading';
  const resultsListPartiallyLoaded = githubRepos.state === 'partial';
  const filteredResults =
    githubRepos.state === 'ready' || githubRepos.state === 'partial'
      ? githubRepos.repositories.filter(r =>
          r.name.toLowerCase().includes(queryString.toLowerCase())
        )
      : null;

  const hasResults =
    githubRepos.state === 'ready' || githubRepos.state === 'partial';
  const noResults =
    githubRepos.state === 'ready' &&
    filteredResults &&
    filteredResults.length === 0;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const parsedInput = getOwnerAndNameFromInput(value);
    if (parsedInput && githubAccounts.state === 'ready') {
      const existingGHAccount = githubAccounts.all.find(
        org => org.login === parsedInput.owner
      );
      if (existingGHAccount) {
        setSelectedAccount(parsedInput.owner);
        setQueryString(parsedInput.name);
        return;
      }
    }

    setQueryString(value);
  };

  return (
    <Stack direction="vertical" gap={4}>
      <Text size={3}>Import from your GitHub organizations</Text>
      <Stack gap={1} align="center">
        {githubAccounts.state === 'ready' ? (
          <AccountSelect
            options={githubAccounts.all}
            value={selectedAccount}
            variant="solid"
            onChange={(account: string) => {
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
          value={queryString}
        />
      </Stack>

      {hasResults && (
        <StyledList as="ul" direction="vertical" gap={1}>
          {filteredResults.map(repo => {
            const isImported = workspaceRepos.find(
              wr => wr.owner === repo.owner.login && wr.name === repo.name
            );

            return (
              <RepoListItem
                key={repo.owner.login + '/' + repo.name}
                repo={repo}
                onClicked={() => {
                  if (isImported) {
                    window.location.href = v2DefaultBranchUrl({
                      owner: repo.owner.login,
                      repoName: repo.name,
                      workspaceId: activeTeamInfo?.id,
                    });
                  } else {
                    track('Import repository - Select - Import clicked');
                    onSelected(repo);
                  }
                }}
                isImported={isImported}
              />
            );
          })}

          {resultsListPartiallyLoaded && (
            <>
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
              <SkeletonText css={{ height: '48px', width: '100%' }} />
            </>
          )}
        </StyledList>
      )}

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

      {noResults && (
        <Text size={3}>
          No repository matching the search. Please double check the repository
          name or try the{' '}
          <UnstyledButtonLink
            style={{ color: 'inherit', textDecoration: 'underline' }}
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
