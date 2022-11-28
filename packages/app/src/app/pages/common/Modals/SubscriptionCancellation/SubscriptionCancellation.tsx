import track from '@codesandbox/common/lib/utils/analytics';
import { Button, Stack } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';

export const SubscriptionCancellationModal: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { modalClosed } = useActions();
  const [loading, createCustomerPortal] = useCreateCustomerPortal({
    team_id: isTeamAdmin ? activeTeam : undefined,
  });

  return (
    <Stack
      css={{
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 32px 32px',
      }}
      direction="vertical"
    >
      hello, world.
      <Stack
        css={{
          flexWrap: 'wrap',
          marginLeft: 'auto',
          marginRight: 0,
        }}
        gap={6}
      >
        <Button onClick={modalClosed} variant="link" autoWidth>
          Continue trial
        </Button>
        <Button
          css={{ padding: '0 32px' }}
          disabled={!isTeamAdmin}
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
          {loading ? 'Loading...' : 'I understand'}
        </Button>
      </Stack>
    </Stack>
  );
};
