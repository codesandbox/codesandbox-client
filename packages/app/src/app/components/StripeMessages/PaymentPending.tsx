import React from 'react';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState } from 'app/overmind';
import { useLocation } from 'react-router-dom';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDismissible } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';

export const PaymentPending: React.FC = () => {
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { hasExpiredTeamTrial } = useWorkspaceSubscription();
  const [isDismissed, dismiss] = useDismissible(
    `DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER_${activeTeam}`
  );
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

  const handleDismiss = () => {
    const event = hasExpiredTeamTrial
      ? 'expired trial dismiss'
      : 'unpaid - dismiss';

    track(`Stripe banner - ${event}`, {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    dismiss();
  };

  const handleAction = () => {
    const event = hasExpiredTeamTrial
      ? 'upgrade after expired trial'
      : 'unpaid - update payment details';

    track(`Stripe banner - ${event}`, {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    createCustomerPortal();
  };

  const buildCopy = () => {
    if (hasExpiredTeamTrial) {
      return `Your trial has expired. ${
        isBillingManager
          ? 'Upgrade for the full CodeSandbox experience'
          : 'Contact team admin to upgrade for the full Codesandbox Experience'
      }.`;
    }

    return `There are some issues with your payment. ${
      isBillingManager
        ? 'Please contact your team admin to update the payment details'
        : 'Please update your payment details'
    }`;
  };

  React.useEffect(() => {
    if (isDismissed) {
      return;
    }

    const event = hasExpiredTeamTrial ? 'expired trial seen' : 'unpaid - seen';

    track(`Stripe banner - ${event}`, {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <MessageStripe variant="warning" onDismiss={handleDismiss}>
      {buildCopy()}
      {isBillingManager ? (
        <MessageStripe.Action
          loading={loadingCustomerPortal}
          onClick={handleAction}
        >
          {hasExpiredTeamTrial ? 'Upgrade now' : 'Update payment'}
        </MessageStripe.Action>
      ) : null}
    </MessageStripe>
  );
};
