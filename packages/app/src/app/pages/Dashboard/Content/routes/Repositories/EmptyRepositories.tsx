import React, { useEffect, useMemo, useState } from 'react';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Link as RouterLink } from 'react-router-dom';

import {
  ArticleCard,
  CreateCard,
  SkeletonText,
  InteractiveOverlay,
  Stack,
  Text,
  Icon,
  Element,
  Link,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useActions, useAppState } from 'app/overmind';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import { RestrictedImportDisclaimer } from 'app/pages/Dashboard/Components/shared/RestrictedImportDisclaimer';
import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { useGitHubAccountRepositories } from 'app/hooks/useGitHubAccountRepositories';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { AccountSelect } from 'app/components/CreateSandbox/Import/AccountSelect';
import { StyledCard } from 'app/pages/Dashboard/Components/shared/StyledCard';
import { SolidSkeleton } from 'app/pages/Dashboard/Components/Skeleton';
import { ProjectFragment as Repository } from 'app/graphql/types';
import { AuthorizeMessage } from 'app/components/CreateSandbox/Import/SuggestedRepositories';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import { EmptyPage } from '../../../Components/EmptyPage';

const DESCRIPTION =
  'Save hours every week by shortening the review cycle and empowering everyone to contribute.<br />Every branch in Repositories is connected to git and has its own sandbox running in a fast microVM.';

export const EmptyRepositories: React.FC = () => {
  const actions = useActions();

  return (
    <EmptyPage.StyledWrapper
      css={{
        gap: '16px',
      }}
    >
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <EmptyPage.StyledGrid
        css={{
          marginTop: '16px',
        }}
      >
        <CreateCard
          icon="github"
          title="Import from GitHub"
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'github',
            });

            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        />
        <ArticleCard
          title="More about repositories"
          thumbnail="/static/img/thumbnails/page_repositories.png"
          url={appendOnboardingTracking(
            'https://codesandbox.io/docs/learn/repositories/overview'
          )}
          onClick={() =>
            track('Empty State Card - Content Card', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'blog-repositories-overview',
            })
          }
        />
      </EmptyPage.StyledGrid>
      <RestrictedImportDisclaimer />
      <Element css={{ height: 8 }} />
      <Suggested />
    </EmptyPage.StyledWrapper>
  );
};

const Suggested = () => {
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
      track('Suggested repos - Imported personal repository into team space', {
        codesandbox: 'V1',
        event_source: 'UI',
      });
    }

    await dashboardActions.importGitHubRepository(repo);
  };

  return (
    <>
      <Stack gap={2}>
        <Text size={16}>Import from </Text>
        {githubAccounts.state === 'loading' ? (
          <SkeletonText />
        ) : (
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
        )}
      </Stack>

      {githubRepos.state === 'loading' ? (
        <EmptyPage.StyledGrid>
          <SolidSkeleton viewMode="grid" />
          <SolidSkeleton viewMode="grid" />
          <SolidSkeleton viewMode="grid" />
        </EmptyPage.StyledGrid>
      ) : null}

      {githubRepos.state === 'ready' && githubRepos.data.length > 0 ? (
        <EmptyPage.StyledGrid as="ul">
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
      {restrictsPrivateRepos ? <AuthorizeMessage /> : null}
    </>
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
            {/* TODO: CTA to upgrade or start trial if free */}
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
