import React, { useEffect, useMemo, useState } from 'react';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import styled from 'styled-components';
import VisuallyHidden from '@reach/visually-hidden';

import {
  Stack,
  Text,
  Icon,
  InteractiveOverlay,
  Button,
  Element,
  SkeletonText,
} from '@codesandbox/components';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';

import { useActions, useAppState } from 'app/overmind';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';

import { fuzzyMatchGithubToCsb } from './utils';
import { useGithubAccounts } from './useGithubOrganizations';
import { useGitHubAccountRepositories } from './useGitHubAccountRepositories';
import { AccountSelect } from './AccountSelect';

export const SuggestedRepositories = () => {
  const { activeTeamInfo } = useAppState();
  const { restrictsPrivateRepos } = useGitHuPermissions();

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

  if (githubAccounts.state === 'loading') {
    return <SkeletonText />;
  }

  return githubAccounts.state === 'ready' && selectedAccount ? (
    <Stack
      direction="vertical"
      gap={3}
      css={{ fontFamily: 'Inter', marginBottom: '16px' }}
    >
      <Stack justify="space-between">
        <AccountSelect
          options={selectOptions}
          value={selectedAccount}
          onChange={(account: string) => {
            setSelectedAccount(account);
          }}
        />
      </Stack>

      {githubRepos.state === 'loading' ? (
        <StyledList direction="vertical" gap={1}>
          <SkeletonText css={{ height: '56px', width: '100%' }} />
          <SkeletonText css={{ height: '56px', width: '100%' }} />
          <SkeletonText css={{ height: '56px', width: '100%' }} />
        </StyledList>
      ) : null}

      {githubRepos.state === 'ready' ? (
        <>
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
          {restrictsPrivateRepos ? <AuthorizeMessage /> : null}
        </>
      ) : null}
    </Stack>
  ) : null;
};

const AuthorizeMessage = () => {
  const { signInGithubClicked } = useActions();

  return (
    <Stack gap={2} align="center">
      <Text
        variant="muted"
        size={12}
      >{`Don't see all your repositories?`}</Text>
      <Button
        onClick={() => signInGithubClicked('private_repos')}
        variant="link"
        autoWidth
        css={{ padding: 0, cursor: 'pointer' }}
      >
        <Stack gap={1} align="center" css={{ color: '#FFFFFF' }}>
          <Text size={12}>Authorize access to private repositories</Text>
          <Element css={{ marginTop: '2px' }}>
            <Icon css={{ display: 'block' }} name="external" size={12} />
          </Element>
        </Stack>
      </Button>
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
