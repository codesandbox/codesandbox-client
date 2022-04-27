import React from 'react';
import { Stack, Text, Link, Button } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { format } from 'date-fns';

import css from '@styled-system/css';
import { useCreateCustomerPortal } from '../../../../../../Pro/upgrade/utils';

export const Stripe = () => {
  const { activeTeam, activeTeamInfo: team } = useAppState();
  const [loading, createCustomerPortal] = useCreateCustomerPortal(activeTeam);

  return (
    <Stack direction="vertical" gap={2}>
      <Link
        onClick={createCustomerPortal}
        size={3}
        variant="active"
        css={css({ fontWeight: 'medium' })}
      >
        {loading ? 'Loading...' : 'Manage subscription'}
      </Link>

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
