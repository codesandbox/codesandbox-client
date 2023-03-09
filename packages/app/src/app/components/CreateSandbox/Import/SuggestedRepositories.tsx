import React, { useEffect, useMemo, useState } from 'react';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import styled from 'styled-components';
import VisuallyHidden from '@reach/visually-hidden';
import { Link as RouterLink } from 'react-router-dom';

import {
  Stack,
  Text,
  Icon,
  InteractiveOverlay,
  Button,
  Element,
  SkeletonText,
  Link,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useActions, useAppState } from 'app/overmind';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import { fuzzyMatchGithubToCsb } from './utils';
import { useGithubAccounts } from './useGithubOrganizations';
import { useGitHubAccountRepositories } from './useGitHubAccountRepositories';
import { AccountSelect } from './AccountSelect';

type SuggestedRepositoriesProps = {
  isImportOnly?: boolean;
  onImportClicked?: () => void;
};

export const SuggestedRepositories = ({
  isImportOnly,
  onImportClicked,
}: SuggestedRepositoriesProps) => {
  const { activeTeamInfo } = useAppState();
  const { modals, dashboard: dashboardActions } = useActions();
  const { restrictsPrivateRepos } = useGitHuPermissions();
  const { isTeamSpace } = useWorkspaceAuthorization();
  const { isFree, isEligibleForTrial } = useWorkspaceSubscription();
  const [isImporting, setIsImporting] = useState<
    { owner: string; name: string } | false
  >(false);

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
  });

  if (githubAccounts.state === 'loading') {
    return <SkeletonText />;
  }

  return githubAccounts.state === 'ready' && selectedAccount ? (
    <Stack
      direction="vertical"
      gap={4}
      css={{
        fontFamily: 'Inter',
        marginBottom: '16px',
        fontWeight: 500,
        // Conditionally spreading an object doesn't work for some reason so
        // I had to move the conditional to separate properties.
        maxHeight: isImportOnly ? '300px' : undefined,
        overflow: isImportOnly ? 'auto' : undefined,
      }}
    >
      <Stack justify="space-between">
        <AccountSelect
          options={selectOptions}
          value={selectedAccount}
          onChange={(account: string) => {
            track('Suggested repos - change account', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            setSelectedAccount(account);
          }}
        />
      </Stack>

      {githubRepos.state === 'loading' ? (
        <StyledList direction="vertical" gap={1}>
          <SkeletonText css={{ height: '64px', width: '100%' }} />
          <SkeletonText css={{ height: '64px', width: '100%' }} />
          <SkeletonText css={{ height: '64px', width: '100%' }} />
        </StyledList>
      ) : null}

      {githubRepos.state === 'ready' ? (
        <>
          <StyledList as="ul" direction="vertical" gap={1}>
            {githubRepos.data?.map(repo => {
              return (
                <InteractiveOverlay key={repo.id}>
                  <StyledItem isDisabled={isFree && repo.private}>
                    <Stack gap={4} align="center">
                      <Icon name="repository" color="#999999B3" />
                      {isFree && repo.private ? (
                        <Text size={13} variant="muted">
                          {repo.name}
                        </Text>
                      ) : (
                        <InteractiveOverlay.Button
                          onClick={async () => {
                            if (isImporting) {
                              return;
                            }

                            const importInfo = {
                              owner: repo.owner.login,
                              name: repo.name,
                            };

                            setIsImporting(importInfo);

                            const isPersonalRepository =
                              repo.owner.login ===
                              githubAccounts?.data?.personal?.login;

                            if (isPersonalRepository && isTeamSpace) {
                              track(
                                'Suggested repos - Imported personal repository into team space',
                                {
                                  codesandbox: 'V1',
                                  event_source: 'UI',
                                }
                              );
                            }

                            const importResult = await dashboardActions.importGitHubRepository(
                              {
                                ...importInfo,
                                redirect: !isImportOnly,
                              }
                            );

                            // If we don't redirect and we get confirmation that the import succeeded
                            if (importResult && onImportClicked) {
                              onImportClicked();
                            }
                          }}
                          disabled={Boolean(isImporting)}
                        >
                          <VisuallyHidden>Import</VisuallyHidden>
                          <Text size={13}>{repo.name}</Text>
                        </InteractiveOverlay.Button>
                      )}
                      {repo.private ? (
                        <>
                          <VisuallyHidden>Private repository</VisuallyHidden>
                          <Icon name="lock" color="#999999" />
                        </>
                      ) : null}
                      {repo.updatedAt ? (
                        <Text size={13} color="#999999B3">
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
                    {isFree && repo.private ? (
                      <StyledIndicator>
                        {isImportOnly ? (
                          <InteractiveOverlay.Button
                            onClick={() => {
                              if (onImportClicked) {
                                onImportClicked();
                              }
                            }}
                          >
                            <Text
                              size={12}
                              css={{
                                display: 'block',
                                width: 152,
                                color: '#999999B3',
                              }}
                              align="right"
                            >
                              <VisuallyHidden>
                                {repo.name} is a private repository.
                              </VisuallyHidden>
                              <Text color="#EDFFA5">
                                {isEligibleForTrial
                                  ? 'Start a free trial '
                                  : 'Upgrade to Pro '}
                              </Text>
                              to import private repositories.
                            </Text>
                          </InteractiveOverlay.Button>
                        ) : (
                          <InteractiveOverlay.Item>
                            <Link
                              as={RouterLink}
                              to="/pro"
                              onClick={() => {
                                track(
                                  'Suggested repos - Upgrade to Pro from private repo',
                                  {
                                    codesandbox: 'V1',
                                    event_source: 'UI',
                                  }
                                );
                                modals.newSandboxModal.close();
                              }}
                            >
                              <Text
                                size={12}
                                css={{
                                  display: 'block',
                                  width: 152,
                                  color: '#999999B3',
                                }}
                                align="right"
                              >
                                <VisuallyHidden>
                                  {repo.name} is a private repository.
                                </VisuallyHidden>
                                <Text color="#C2C2C2">
                                  {isEligibleForTrial
                                    ? 'Start a free trial '
                                    : 'Upgrade to Pro '}
                                </Text>
                                to import private repositories.
                              </Text>
                            </Link>
                          </InteractiveOverlay.Item>
                        )}
                      </StyledIndicator>
                    ) : (
                      <StyledIndicator aria-hidden>
                        <StyledImportIndicator>
                          {isImporting &&
                          isImporting.owner === repo.owner.login &&
                          isImporting.name === repo.name ? (
                            <Button
                              css={{
                                height: '16px', // match the text height so the content doesn't jump around when the state changes.
                              }}
                              role="presentation"
                              variant="ghost"
                              autoWidth
                              loading
                            />
                          ) : (
                            'Import'
                          )}
                        </StyledImportIndicator>
                      </StyledIndicator>
                    )}
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
      <Text variant="muted" size={12}>
        Don&apos;t see all your repositories?
      </Text>
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

const StyledIndicator = styled.span`
  opacity: 0;
`;

const StyledItem = styled.li<{ isDisabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #1d1d1d;
  border-radius: 4px;
  height: 32px;
  align-items: center;

  &:hover,
  &:focus-within {
    ${({ isDisabled }) =>
      !isDisabled &&
      `
        background-color: #252525;
      `}

    ${StyledIndicator} {
      opacity: 1;
    }
  }
`;

const StyledImportIndicator = styled.span`
  box-sizing: border-box;
  min-width: 80px;
  padding: 8px;
  border-radius: 4px;
  background-color: #343434;
  color: #c2c2c2;
  font-size: 12px;
  text-align: center;
`;
