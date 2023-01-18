import React from 'react';
import { format } from 'date-fns';
import { Stack, Text, Link } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';

export const Stripe: React.FC = () => {
  const { openCancelSubscriptionModal } = useActions();
  const { activeTeam } = useAppState();
  const {
    subscription,
    hasActiveTeamTrial,
    hasPaymentMethod,
  } = useWorkspaceSubscription();
  const [loading, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeam,
  });

  if (!subscription) {
    return null;
  }

  // When the subscription has been actively cancelled by the team admin
  if (subscription.cancelAt) {
    return (
      <Stack
        css={{ height: '100%' }}
        direction="vertical"
        justify="space-between"
      >
        <Text size={3} css={{ color: '#F7CC66' }}>
          Your access to Pro features will expire on on{' '}
          {format(new Date(subscription.cancelAt), 'PP')}. After this period,
          your team will be automatically migrated to the Free plan.
        </Text>

        <Link
          onClick={() => {
            track('Team Settings - Renew subscription', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            createCustomerPortal();
          }}
          size={3}
          variant="active"
        >
          {loading ? 'Loading...' : 'Upgrade to Pro'}
        </Link>
      </Stack>
    );
  }

  const updateSubscriptionText = `${
    hasPaymentMethod ? 'Update' : 'Add'
  } payment details`;

  return (
    <Stack direction="vertical" gap={2}>
      <Link
        onClick={() => {
          track('Team Settings - Update payment details', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          createCustomerPortal();
        }}
        size={3}
        variant="active"
      >
        {loading ? 'Loading...' : updateSubscriptionText}
      </Link>
      <Link
        color="#EE8269"
        onClick={() => {
          track(
            hasActiveTeamTrial
              ? 'Team Settings: open cancel trial modal'
              : 'Team Settings: open cancel subscription modal',
            {
              codesandbox: 'V1',
              event_source: 'UI',
            }
          );

          openCancelSubscriptionModal();
        }}
        size={3}
      >
        {hasActiveTeamTrial ? 'Cancel trial' : 'Cancel subscription'}
      </Link>
    </Stack>
  );
};
