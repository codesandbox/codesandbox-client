import React from 'react';
import { format } from 'date-fns';
import { Stack, Text, Link } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';

export const Stripe: React.FC<{ hasActiveTrial: boolean }> = ({
  hasActiveTrial,
}) => {
  const { activeTeam, activeTeamInfo: team } = useAppState();
  const [loading, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeam,
  });

  const ctaText = hasActiveTrial ? 'Cancel trial' : 'Manage subscription';

  return (
    <Stack direction="vertical" gap={2}>
      <Link onClick={createCustomerPortal} size={3} variant="active">
        {loading ? 'Loading...' : ctaText}
      </Link>

      {!loading && team.subscription.cancelAt && (
        <Text size={3} css={{ color: '#F7CC66' }}>
          Your subscription expires on{' '}
          {format(new Date(team.subscription.cancelAt), 'PP')}.{' '}
        </Text>
      )}
    </Stack>
  );
};
