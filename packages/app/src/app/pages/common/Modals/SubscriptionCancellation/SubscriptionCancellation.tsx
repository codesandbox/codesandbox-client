import track from '@codesandbox/common/lib/utils/analytics';
import { Button, IconButton, Stack, Text } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import styled from 'styled-components';

// const LIMITS = [
//   '-3 editor seats',
//   '25 sandboxes will be restricted',
//   '7 repositories will be restricted',
// ];

const StyledListItem = styled('li')`
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  color: #ef7a7a;
`;

export const SubscriptionCancellationModal: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { modalClosed } = useActions();
  const [loadingCustomerPortal, createCustomerPortal] = useCreateCustomerPortal(
    {
      team_id: isTeamAdmin ? activeTeam : undefined,
    }
  );

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
        <StyledListItem>Limited to 5 editors seats</StyledListItem>
        <StyledListItem>Limited to 20 public sandboxes</StyledListItem>
        <StyledListItem>Limited to 3 public repositories</StyledListItem>
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
          Continue trial
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
