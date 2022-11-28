import track from '@codesandbox/common/lib/utils/analytics';
import { Button, IconButton, Stack, Text } from '@codesandbox/components';
import { TEAM_FREE_LIMITS } from 'app/constants';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import styled from 'styled-components';

const StyledListItem = styled('li')`
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  color: #ef7a7a;
`;

export const SubscriptionCancellationModal: React.FC = () => {
  const { activeTeamInfo } = useAppState();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { hasActiveTeamTrial } = useWorkspaceSubscription();
  const { modalClosed } = useActions();
  const [loadingCustomerPortal, createCustomerPortal] = useCreateCustomerPortal(
    {
      team_id: isTeamAdmin ? activeTeamInfo?.id : undefined,
    }
  );
  // TO DO: if we need this info more often, extract
  // to a custom useWorkspaceUsage similar to
  // useWorkspaceLimits.
  const teamUsage = activeTeamInfo?.usage;

  const getEditorsLabel = () => {
    if (teamUsage && teamUsage.editorsQuantity > TEAM_FREE_LIMITS.editors) {
      const lostSeats = teamUsage.editorsQuantity - TEAM_FREE_LIMITS.editors;
      return `-${lostSeats} editor seat${lostSeats === 1 ? '' : 's'}`;
    }

    return `Limited to ${TEAM_FREE_LIMITS.editors} editors seats`;
  };

  // Private sandboxes are a Pro feature only. If the
  // team downgrades, these will become restricted.
  // Public sandboxes do not get restricted on
  // downgrading but are limited to a certain amount
  // if the team does not have an active subscription.
  const getSandboxesLabel = () => {
    const restrictedSandboxesCount =
      (teamUsage?.privateProjectsQuantity ?? 0) -
      TEAM_FREE_LIMITS.private_repos;
    if (restrictedSandboxesCount > 0) {
      return `${restrictedSandboxesCount} sandbox${
        restrictedSandboxesCount === 1 ? '' : 'es'
      } will be restricted`;
    }

    return `Limited to ${TEAM_FREE_LIMITS.public_sandboxes} public sandboxes`;
  };

  // Private repositories are a Pro feature only. If the
  // team downgrades, these will become restricted.
  // Public repositories do not get restricted on
  // downgrading but are limited to a certain amount
  // if the team does not have an active subscription.
  const getRepositoriesLabel = () => {
    const restrictedRepositoriesCount =
      (teamUsage?.privateProjectsQuantity ?? 0) -
      TEAM_FREE_LIMITS.private_repos;
    if (restrictedRepositoriesCount > 0) {
      return `${restrictedRepositoriesCount} repositor${
        restrictedRepositoriesCount === 1 ? 'y' : 'ies'
      } will be restricted`;
    }

    return `Limited to ${TEAM_FREE_LIMITS.public_repos} public repositories`;
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
      <Stack>
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
          You&apos;ll lose access to all Pro features if you decide to cancel
        </Text>
        <IconButton name="cross" title="Close" />
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
        <StyledListItem>{getEditorsLabel()}</StyledListItem>
        <StyledListItem>{getSandboxesLabel()}</StyledListItem>
        <StyledListItem>{getRepositoriesLabel()}</StyledListItem>
        <StyledListItem>Only public NPM packages</StyledListItem>
        <StyledListItem>Only basic privacy settings</StyledListItem>
        <StyledListItem>-67% GB RAM</StyledListItem>
        <StyledListItem>-33% Disk space</StyledListItem>
        <StyledListItem>-2 vCPUs</StyledListItem>
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
        <Button onClick={modalClosed} variant="link" autoWidth>
          {hasActiveTeamTrial ? 'Continue trial' : 'Keep subscription'}
        </Button>
        <Button
          css={{ padding: '0 32px' }}
          disabled={!isTeamAdmin}
          loading={loadingCustomerPortal}
          onClick={() => {
            if (!isTeamAdmin) {
              return;
            }

            // TO DO: confirm event name.
            track(
              'Team Settings - Open stripe portal from subscription cancellation modal',
              {
                codesandbox: 'V1',
                event_source: 'UI',
              }
            );

            createCustomerPortal();
          }}
          autoWidth
        >
          I understand
        </Button>
      </Stack>
    </Stack>
  );
};
