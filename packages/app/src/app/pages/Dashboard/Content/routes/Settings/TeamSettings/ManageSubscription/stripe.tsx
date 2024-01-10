import React from 'react';
import { format } from 'date-fns';
import { Stack, Text, Button } from '@codesandbox/components';
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
        <Text size={3} color="#F7CC66">
          Your access to Pro features will expire on on{' '}
          {format(new Date(subscription.cancelAt), 'PP')}. After this period,
          your team will be automatically migrated to the Free plan.
        </Text>

        <Button
          autoWidth
          variant="link"
          css={{
            height: 'auto',
            padding: 0,
          }}
          onClick={() => {
            track('Team Settings - Renew subscription', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            createCustomerPortal();
          }}
        >
          {loading ? 'Loading...' : 'Upgrade to Pro'}
        </Button>
      </Stack>
    );
  }

  const updateSubscriptionText = `${
    hasPaymentMethod ? 'Update' : 'Add'
  } payment details`;

  return (
    <Stack direction="vertical" gap={2}>
      <Button
        autoWidth
        variant="link"
        css={{
          height: 'auto',
          padding: 0,
        }}
        onClick={() => {
          track('Team Settings - Update payment details', {
            codesandbox: 'V1',
            event_source: 'UI',
          });

          createCustomerPortal();
        }}
      >
        {loading ? 'Loading...' : updateSubscriptionText}
      </Button>
      <Button
        autoWidth
        variant="link"
        css={{
          height: 'auto',
          padding: 0,
          color: '#EE8269',
        }}
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
      >
        {hasActiveTeamTrial ? 'Cancel trial' : 'Cancel subscription'}
      </Button>
    </Stack>
  );
};
