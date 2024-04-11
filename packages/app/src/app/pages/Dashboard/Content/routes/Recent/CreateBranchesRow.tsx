import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Text } from '@codesandbox/components';
import { Carousel } from 'app/pages/Dashboard/Components/Carousel/Carousel';
import { ActionCard } from 'app/pages/Dashboard/Components/shared/ActionCard';
import { useActions, useAppState } from 'app/overmind';

type RepoInfo = { owner: string; name: string; defaultBranch: string };

export const CreateBranchesRow: React.FC<{
  repos: Array<RepoInfo>;
  isFrozen: boolean;
}> = ({ repos, isFrozen }) => {
  const { activeTeam } = useAppState();
  const actions = useActions();

  const items = repos
    .map(repo => {
      return {
        id: `${repo.owner}/${repo.name}`,
        Component: CreateBranchCard,
        props: {
          repo,
          isFrozen,
          onClick: evt => {
            track('Recent Pae - Explore workspace - Create new branch');
            actions.dashboard.createDraftBranch({
              owner: repo.owner,
              name: repo.name,
              teamId: activeTeam,
              openInNewTab: evt.ctrlKey || evt.metaKey,
            });
          },
        },
      };
    })
    .filter(Boolean);

  return (
    <Stack direction="vertical" gap={4}>
      <Text as="h3" margin={0} size={4} weight="400">
        Start working on existing repositories
      </Text>
      <Carousel items={items} />
    </Stack>
  );
};

const CreateBranchCard: React.FC<{
  repo: RepoInfo;
  isFrozen: boolean;
  onClick: () => void;
}> = ({ repo, isFrozen, onClick }) => (
  <ActionCard onClick={onClick} icon="branch" disabled={isFrozen}>
    <Stack gap={1} direction="vertical">
      <Text truncate weight="500">
        {repo.name}
      </Text>
      <Text variant="muted">
        Create new branch from{' '}
        <Text color="#e5e5e5" weight="500">
          {repo.defaultBranch}
        </Text>
      </Text>
    </Stack>
  </ActionCard>
);
