import React from 'react';
import { Stack, Text, Button } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { format } from 'date-fns';

import css from '@styled-system/css';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';

export const Stripe = () => {
  const { activeTeam, activeTeamInfo: team } = useAppState();
  const [loading, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeam,
  });

  return (
    <Stack direction="vertical" gap={2}>
      <Button
        autoWidth
        css={{ height: 'auto', padding: 0 }}
        variant="link"
        onClick={createCustomerPortal}
      >
        {loading ? 'Loading...' : 'Manage subscription'}
      </Button>

      {!loading && team.subscription.cancelAt && (
        <Text size={3} css={css({ color: '#F7CC66' })}>
          Your subscription expires on{' '}
          {format(new Date(team.subscription.cancelAt), 'PP')}.{' '}
          <Button
            autoWidth
            variant="link"
            css={css({
              color: 'inherit',
              padding: 0,
              textDecoration: 'underline',
              fontSize: 3,
            })}
            onClick={createCustomerPortal}
          >
            Reactivate subscription
          </Button>
        </Text>
      )}
    </Stack>
  );
};
