import { Stack, Text, Icon, InteractiveOverlay } from '@codesandbox/components';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import VisuallyHidden from '@reach/visually-hidden';
import { useAppState } from 'app/overmind';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import { fuzzyMatchGithubToCsb } from './utils';
import { useGithubAccounts } from './useGithubOrganizations';
import { useGitHubAccountRepositories } from './useGitHubAccountRepositories';
import { StyledSelect } from '../elements';

export const SuggestedRepositories = () => {
  const { activeTeamInfo } = useAppState();
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const githubAccounts = useGithubAccounts();

  const selectOptions = useMemo(
    () =>
      githubAccounts.data
        ? [githubAccounts.data.personal, ...githubAccounts.data.organizations]
        : undefined,
    [githubAccounts.data]
  );

  useEffect(() => {
    // Set initially selected account bazed on fuzzy matching
    if (githubAccounts.state === 'ready' && selectedAccount === undefined) {
      const match = fuzzyMatchGithubToCsb(activeTeamInfo?.name, selectOptions);

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
  });

  return githubAccounts.state === 'ready' && selectedAccount ? (
    <Stack direction="vertical" gap={3} css={{ fontFamily: 'Inter' }}>
      <Stack justify="space-between">
        <StyledSelect
          css={{
            color: '#e5e5e5',
          }}
          icon={() => <Icon css={{ marginLeft: 8 }} name="github" />}
          onChange={e => {
            setSelectedAccount(e.target.value);
          }}
          value={selectedAccount}
        >
          {selectOptions.map(account => (
            <option key={account.id} value={account.login}>
              {account.login}
            </option>
          ))}
        </StyledSelect>
      </Stack>
      {githubRepos.state === 'ready' ? (
        <StyledList as="ul" direction="vertical" gap={1}>
          {githubRepos.data?.map(repo => {
            const importUrl = v2DefaultBranchUrl({
              owner: repo.owner.login,
              repoName: repo.name,
              workspaceId: activeTeamInfo.id,
              importFlag: true,
            });

            return (
              <InteractiveOverlay key={repo.id}>
                <StyledItem>
                  <Stack gap={4} align="center">
                    <Icon name="repository" color="#999999" />
                    <InteractiveOverlay.Anchor href={importUrl}>
                      <VisuallyHidden>Import</VisuallyHidden>
                      <Text size={13}>{repo.name}</Text>
                    </InteractiveOverlay.Anchor>
                    {repo.private ? (
                      <>
                        <VisuallyHidden>Private repository</VisuallyHidden>
                        <Icon name="lock" color="#999999" />
                      </>
                    ) : null}
                    {repo.updatedAt ? (
                      <Text size={13} variant="muted">
                        <VisuallyHidden>Last updated</VisuallyHidden>
                        {formatDistanceStrict(
                          zonedTimeToUtc(repo.updatedAt, 'Etc/UTC'),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </Text>
                    ) : null}
                  </Stack>
                  <StyledIndicator aria-hidden>Import</StyledIndicator>
                </StyledItem>
              </InteractiveOverlay>
            );
          })}
        </StyledList>
      ) : null}
    </Stack>
  ) : null;
};

const StyledList = styled(Stack)`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 14px;
  background-color: #1d1d1d;
  border-radius: 4px;

  &:hover,
  &:focus-within {
    background-color: #252525;
  }
`;

const StyledIndicator = styled.span`
  box-sizing: border-box;
  min-width: 80px;
  opacity: 0;
  padding: 8px;
  background-color: #343434;
  font-size: 12px;
  text-align: center;

  ${StyledItem}:hover &, ${StyledItem}:focus-within & {
    opacity: 1;
  }
`;
