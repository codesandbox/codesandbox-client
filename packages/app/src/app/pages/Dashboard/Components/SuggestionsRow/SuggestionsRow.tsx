import React, { useEffect, useState } from 'react';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';

import {
  SkeletonText,
  InteractiveOverlay,
  Stack,
  Text,
  Icon,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useActions, useAppState } from 'app/overmind';
import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { useGitHubAccountRepositories } from 'app/hooks/useGitHubAccountRepositories';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { AccountSelect } from 'app/components/Create/ImportRepository/components/AccountSelect';
import { StyledCard } from 'app/pages/Dashboard/Components/shared/StyledCard';
import { SolidSkeleton } from 'app/pages/Dashboard/Components/Skeleton';
import { ProjectFragment as Repository } from 'app/graphql/types';

import { GithubRepoToImport } from 'app/components/Create/utils/types';
import { EmptyPage } from '../EmptyPage';

export const SuggestionsRow = ({ page }: { page: string }) => {
  const { activeTeamInfo } = useAppState();
  const actions = useActions();
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const githubAccounts = useGithubAccounts();

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

  const githubRepos = useGitHubAccountRepositories({
    name: selectedAccount,
    accountType: selectedAccountType,
    limit: 12,
  });

  const handleClick = (repo: GithubRepoToImport) => {
    track(`Suggested repos - Select repository to import`);
    actions.modalOpened({
      modal: 'importRepository',
      repoToImport: { owner: repo.owner.login, name: repo.name },
    });
  };

  return (
    <EmptyPage.StyledGridWrapper>
      <Stack gap={2} align="center">
        <Text size={16}>
          {page === 'empty repositories' ? 'Start by importing' : 'Import'} from{' '}
        </Text>
        {githubAccounts.state === 'loading' ? <SkeletonText /> : null}

        {githubAccounts.state === 'ready' && selectedAccount ? (
          <AccountSelect
            options={githubAccounts.all}
            value={selectedAccount}
            onChange={(account: string) => {
              track('Suggested repos - change account');

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
        <EmptyPage.StyledGrid as="ul">
          {githubRepos.data.map(repo => {
            const pushedAt = formatDistanceStrict(
              zonedTimeToUtc(repo.pushedAt, 'Etc/UTC'),
              new Date(),
              {
                addSuffix: true,
              }
            );

            return (
              <SuggestionCard
                key={`${repo.owner.login}/${repo.name}`}
                owner={repo.owner.login}
                name={repo.name}
                isPrivate={repo.private}
                pushedAt={pushedAt}
                onClick={() => {
                  handleClick(repo);
                }}
              />
            );
          })}
        </EmptyPage.StyledGrid>
      ) : null}

      {githubRepos.state === 'ready' && githubRepos.data.length === 0 ? (
        <Text>No GitHub repositories found to import.</Text>
      ) : null}
    </EmptyPage.StyledGridWrapper>
  );
};

type SuggestionCardProps = Pick<Repository['repository'], 'owner' | 'name'> & {
  isPrivate?: boolean;
  pushedAt?: string;
  onClick?: () => void;
};

const SuggestionCard = ({
  owner,
  name,
  isPrivate,
  pushedAt,
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
            {pushedAt ? <Text size={12}>{pushedAt}</Text> : null}
          </Stack>
        </Stack>
      </StyledCard>
    </InteractiveOverlay>
  );
};
