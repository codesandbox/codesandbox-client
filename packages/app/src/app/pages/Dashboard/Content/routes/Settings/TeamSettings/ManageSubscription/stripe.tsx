import React from 'react';
import { format } from 'date-fns';
import { Stack, Text, Link } from '@codesandbox/components';
// import track from '@codesandbox/common/lib/utils/analytics';
import { useActions } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const Stripe: React.FC = () => {
  const { openCancelSubscriptionModal } = useActions();
  const { subscription, hasActiveTeamTrial } = useWorkspaceSubscription();

  return (
    <Stack direction="vertical" gap={2}>
      <Link
        onClick={() => {
          // if (hasActiveTrial) {
          //   track('Team Settings - Cancel trial', {
          //     codesandbox: 'V1',
          //     event_source: 'UI',
          //   });
          // } else {
          //   track('Team Settings - Manage Subscription', {
          //     codesandbox: 'V1',
          //     event_source: 'UI',
          //   });
          // }

          openCancelSubscriptionModal();
        }}
        size={3}
        variant="active"
      >
        {hasActiveTeamTrial ? 'Cancel trial' : 'Manage subscription'}
      </Link>

      {subscription?.cancelAt ? (
        <Text size={3} css={{ color: '#F7CC66' }}>
          Your subscription expires on{' '}
          {format(new Date(subscription.cancelAt), 'PP')}.{' '}
        </Text>
      ) : null}
    </Stack>
  );
};
