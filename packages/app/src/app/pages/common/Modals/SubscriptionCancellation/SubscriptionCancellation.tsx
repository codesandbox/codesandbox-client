import track from '@codesandbox/common/lib/utils/analytics';
import {
  Badge,
  Button,
  IconButton,
  Stack,
  Text,
} from '@codesandbox/components';
import { TEAM_FREE_LIMITS } from 'app/constants';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { pluralize } from 'app/utils/pluralize';
import React from 'react';

type FeatureComp = {
  key: string;
  free: string;
  pro: string;
  pill?: string;
};
const FEATURES: FeatureComp[] = [
  {
    key: 'editors',
    pro: 'Up to 20 editors',
    free: 'Limited to 5 editors',
  },
  {
    key: 'sandboxes',
    pro: 'Unlimited private sandboxes',
    free: 'Limited to 20 public sandboxes',
  },
  {
    key: 'repos',
    pro: 'Unlimited private repositories',
    free: 'Limited to 3 public repositories',
  },
  {
    key: 'npm',
    pro: 'Private NPM packages',
    free: 'Limited to public NPM packages',
  },
  {
    key: 'ram',
    pro: '6GB RAM',
    free: '4GB RAM',
    pill: '-33% capacity',
  },
  {
    key: 'cpu',
    pro: '4 vCPUs',
    free: '2 vCPUs',
    pill: '-2 vCPUs',
  },
  {
    key: 'disk',
    pro: '12GB Disk',
    free: '6GB Disk',
    pill: '-50% storage',
  },
];

const FEATURES_WITH_DYNAMIC_PILLS = ['editors', 'sandboxes', 'repos'];

export const SubscriptionCancellationModal: React.FC = () => {
  const { activeTeamInfo } = useAppState();
  const { hasActiveTeamTrial, isPaddle } = useWorkspaceSubscription();
  const [paddleLoading, setPaddeLoading] = React.useState(false);
  const { modalClosed, pro } = useActions();
  const [loadingCustomerPortal, createCustomerPortal] = useCreateCustomerPortal(
    {
      team_id: activeTeamInfo?.id,
    }
  );

  const handleCloseModal = () => {
    track('Team Settings: close cancel subscription modal', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    modalClosed();
  };

  // TO DO: if we need this info more often, extract
  // to a custom useWorkspaceUsage similar to
  // useWorkspaceLimits.
  const teamUsage = activeTeamInfo?.usage;

  const getEditorsLabel = () => {
    if (teamUsage && teamUsage.editorsQuantity > TEAM_FREE_LIMITS.editors) {
      const lostSeats = teamUsage.editorsQuantity - TEAM_FREE_LIMITS.editors;
      return `-${lostSeats} editor ${pluralize({
        word: 'seat',
        count: lostSeats,
      })}`;
    }

    return undefined;
  };

  const getSandboxesLabel = () => {
    const restrictedSandboxesCount =
      (teamUsage?.privateProjectsQuantity ?? 0) -
      TEAM_FREE_LIMITS.private_repos;
    if (restrictedSandboxesCount > 0) {
      return `${restrictedSandboxesCount} restricted`;
    }

    return undefined;
  };

  const getReposLabel = () => {
    const restrictedRepositoriesCount =
      (teamUsage?.privateProjectsQuantity ?? 0) -
      TEAM_FREE_LIMITS.private_repos;
    if (restrictedRepositoriesCount > 0) {
      return `${restrictedRepositoriesCount} restricted`;
    }

    return undefined;
  };

  return (
    <Stack
      css={{
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 32px 32px',
      }}
      direction="vertical"
    >
      <Stack justify="space-between">
        <Text
          as="h1"
          css={{
            margin: 0,
            lineHeight: '28px',
            letterSpacing: '-0.019em',
          }}
          size={19}
          weight="normal"
        >
          You&apos;ll lose access to all Pro features
        </Text>
        <IconButton name="cross" title="Close" onClick={handleCloseModal} />
      </Stack>
      <Stack
        as="ul"
        css={{
          listStyle: 'none',
          margin: '24px 0 0',
          padding: 0,
        }}
        direction="vertical"
        gap={6}
      >
        {FEATURES.map(f => {
          let badge = f.pill;
          if (FEATURES_WITH_DYNAMIC_PILLS.includes(f.key)) {
            badge = {
              editors: getEditorsLabel(),
              sandboxes: getSandboxesLabel(),
              repos: getReposLabel(),
            }[f.key];
          }

          return (
            <Stack direction="vertical" key={f.key} gap={1}>
              <Text
                css={{
                  textDecoration: 'line-through',
                  color: '#999999',
                }}
                size={13}
              >
                {f.pro}
              </Text>
              <Stack align="baseline" gap={3}>
                <Text size={13}>{f.free}</Text>
                {badge ? <Badge variant="warning">{badge}</Badge> : null}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      <Stack
        css={{
          flexWrap: 'wrap',
          marginLeft: 'auto',
          marginRight: 0,
          marginTop: '32px',
        }}
        gap={6}
      >
        <Button onClick={handleCloseModal} variant="link" autoWidth>
          {hasActiveTeamTrial ? 'Continue trial' : 'Continue subscription'}
        </Button>
        {isPaddle ? (
          <Button
            css={{ padding: '0 32px' }}
            loading={paddleLoading}
            onClick={() => {
              setPaddeLoading(true);
              track('Team Settings - confirm paddle cancel subscription', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              pro.cancelWorkspaceSubscription();
            }}
            autoWidth
          >
            I understand
          </Button>
        ) : (
          <Button
            css={{ padding: '0 32px' }}
            loading={loadingCustomerPortal}
            onClick={() => {
              track('Team Settings: confirm cancellation from modal', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createCustomerPortal();
            }}
            autoWidth
          >
            OK
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
