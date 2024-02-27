import React, { useEffect, useMemo, useState } from 'react';
import VisuallyHidden from '@reach/visually-hidden';

import track from '@codesandbox/common/lib/utils/analytics';
import {
  Icon,
  Input,
  SkeletonText,
  Stack,
  Text,
  InteractiveOverlay,
} from '@codesandbox/components';

import { useAppState } from 'app/overmind';

import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { useGitHubAccountRepositories } from 'app/hooks/useGitHubAccountRepositories';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import styled from 'styled-components';
import { GithubRepoToImport } from '../../utils/types';
import { getOwnerAndNameFromInput } from '../utils';
import { AccountSelect } from '../components/AccountSelect';

type SelectRepoProps = {
  onSelected: (repo: GithubRepoToImport) => void;
};
export const SelectRepo: React.FC<SelectRepoProps> = ({ onSelected }) => {
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
          r.fullName.toLowerCase().includes(queryString.toLowerCase())
        )
      : null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const parsedInput = getOwnerAndNameFromInput(value);

    setQueryString(event.target.value);
  };

  return (
    <Stack direction="vertical" gap={4}>
      <Text size={4}>Select a repository in your GitHub organizations</Text>

      <Stack gap={2}>
        <AccountSelect
          options={selectOptions}
          value={selectedAccount}
          onChange={(account: string) => {
            track('Import repo - Select - Change GH Org');

            setSelectedAccount(account);
          }}
        />

        <Input
          css={{
            height: '32px',
          }}
          placeholder="Search"
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

      {filteredResults !== null && (
        <StyledList as="ul" direction="vertical" gap={1}>
          {filteredResults.map(repo => {
            return (
              <InteractiveOverlay key={repo.id}>
                <StyledItem>
                  <Stack gap={2} align="center">
                    <Icon name="github" />
                    <InteractiveOverlay.Button
                      onClick={() => {
                        onSelected(repo);
                      }}
                    >
                      <VisuallyHidden>Import</VisuallyHidden>
                      <Text size={13}>{repo.name}</Text>
                    </InteractiveOverlay.Button>

                    {repo.private ? (
                      <>
                        <VisuallyHidden>Private repository</VisuallyHidden>
                        <Icon name="lock" color="#999999" />
                      </>
                    ) : null}
                    {repo.pushedAt ? (
                      <Text size={13} color="#999999B3">
                        <VisuallyHidden>Last updated</VisuallyHidden>
                        {formatDistanceStrict(
                          zonedTimeToUtc(repo.pushedAt, 'Etc/UTC'),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </Text>
                    ) : null}
                  </Stack>
                </StyledItem>
              </InteractiveOverlay>
            );
          })}
        </StyledList>
      )}
    </Stack>
  );
};

const StyledList = styled(Stack)`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #1d1d1d;
  border-radius: 4px;
  height: 32px;
  align-items: center;

  &:hover,
  &:focus-within {
    background-color: #252525;
  }
`;
