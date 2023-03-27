import React, { useEffect, useMemo, useState } from 'react';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Link as RouterLink } from 'react-router-dom';

import {
  SkeletonText,
  InteractiveOverlay,
  Stack,
  Text,
  Icon,
  Link,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useActions, useAppState } from 'app/overmind';
import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { useGitHubAccountRepositories } from 'app/hooks/useGitHubAccountRepositories';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { AccountSelect } from 'app/components/CreateSandbox/Import/AccountSelect';
import { StyledCard } from 'app/pages/Dashboard/Components/shared/StyledCard';
import { SolidSkeleton } from 'app/pages/Dashboard/Components/Skeleton';
import { ProjectFragment as Repository } from 'app/graphql/types';
import { AuthorizeForSuggested } from 'app/components/CreateSandbox/Import/AuthorizeForSuggested';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import { EmptyPage } from '../EmptyPage';

export const SuggestionsRow = () => {
  const { activeTeamInfo } = useAppState();
  const { dashboard: dashboardActions } = useActions();
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const githubAccounts = useGithubAccounts();
  const { restrictsPrivateRepos } = useGitHuPermissions();
  const { isTeamSpace } = useWorkspaceAuthorization();
  const { isFree } = useWorkspaceSubscription();

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

  const handleImport = async (
    repo: Pick<Repository['repository'], 'owner' | 'name'>
  ) => {
    setIsImporting(true);

    const isPersonalRepository =
      repo.owner === githubAccounts?.data?.personal?.login;

    if (isPersonalRepository && isTeamSpace) {
      track(
        'Suggested repos empty page - Imported personal repository into team space',
        {
          codesandbox: 'V1',
          event_source: 'UI',
        }
      );
    } else {
      track(
        'Suggested repos empty page - Imported organization repository into team space',
        {
          codesandbox: 'V1',
          event_source: 'UI',
        }
      );
    }

    await dashboardActions.importGitHubRepository(repo);
  };

  return (
    <EmptyPage.StyledGridWrapper>
      <Stack gap={2}>
        <Text size={16}>Start by importing from </Text>
        {githubAccounts.state === 'loading' ? <SkeletonText /> : null}

        {githubAccounts.state === 'ready' && selectedAccount ? (
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
        ) : null}
      </Stack>

      {githubRepos.state === 'loading' ? (
        <EmptyPage.StyledGrid>
          <SolidSkeleton viewMode="grid" />
          <SolidSkeleton viewMode="grid" />
          <SolidSkeleton viewMode="grid" />
        </EmptyPage.StyledGrid>
      ) : null}

      {githubRepos.state === 'ready' && githubRepos.data.length > 0 ? (
        <EmptyPage.StyledGrid
          as="ul"
          css={{ opacity: isImporting ? '0.8' : 1 }}
        >
          {githubRepos.data.map(repo => {
            const updatedAt = formatDistanceStrict(
              zonedTimeToUtc(repo.updatedAt, 'Etc/UTC'),
              new Date(),
              {
                addSuffix: true,
              }
            );

            return (
              <SuggestionCard
                owner={repo.owner.login}
                name={repo.name}
                isPrivate={repo.private}
                updatedAt={updatedAt}
                onClick={
                  isImporting
                    ? undefined
                    : () => {
                        handleImport({
                          owner: repo.owner.login,
                          name: repo.name,
                        });
                      }
                }
              />
            );
          })}
        </EmptyPage.StyledGrid>
      ) : null}

      {githubRepos.state === 'ready' && githubRepos.data.length === 0 ? (
        <Text>No GitHub repositories found to import.</Text>
      ) : null}

      {isFree ? <UpgradeMessage /> : null}
      {restrictsPrivateRepos ? <AuthorizeForSuggested /> : null}
    </EmptyPage.StyledGridWrapper>
  );
};

type SuggestionCardProps = Pick<Repository['repository'], 'owner' | 'name'> & {
  isPrivate?: boolean;
  updatedAt?: string;
  onClick?: () => void;
};

const SuggestionCard = ({
  owner,
  name,
  isPrivate,
  updatedAt,
  onClick,
}: SuggestionCardProps) => {
  return (
    <InteractiveOverlay>
      <StyledCard as="li">
        <Stack
          direction="vertical"
          justify="space-between"
          css={{ height: '100%' }}
        >
          <Stack direction="vertical" gap={1}>
            <Text size={12} color="#999999">
              {owner}
            </Text>
            <InteractiveOverlay.Button onClick={onClick}>
              <VisuallyHidden>Import </VisuallyHidden>
              <Text size={13} color="#EBEBEB">
                {name}
              </Text>
            </InteractiveOverlay.Button>
          </Stack>
          <Stack gap={3} align="center">
            {isPrivate ? <Icon color="#999" name="lock" size={12} /> : null}
            {updatedAt ? <Text size={12}>{updatedAt}</Text> : null}
          </Stack>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};

const UpgradeMessage = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();

  return (
    <Text color="#999999" size={12}>
      <Link
        as={RouterLink}
        to="/pro"
        onClick={() => {
          track(
            `Suggested repos - ${
              isEligibleForTrial ? 'Start a trial' : 'Upgrade to Pro'
            } from empty repositories page`,
            {
              codesandbox: 'V1',
              event_source: 'UI',
            }
          );
        }}
      >
        <Text color="#EDFFA5">
          {isEligibleForTrial ? 'Start a free trial' : 'Upgrade to Pro'}{' '}
        </Text>
      </Link>{' '}
      to import private repositories.
    </Text>
  );
};
