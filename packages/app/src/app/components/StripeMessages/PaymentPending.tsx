import React from 'react';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState } from 'app/overmind';
import { useLocation } from 'react-router-dom';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useDismissible } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { SubscriptionStatus } from 'app/graphql/types';

export const PaymentPending: React.FC<{ status: SubscriptionStatus }> = ({
  status,
}) => {
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const { isBillingManager } = useWorkspaceAuthorization();
  const [isDismissed, dismiss] = useDismissible(
    `DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER_${activeTeam}`
  );
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

  const handleDismiss = () => {
    track(`Payment Pending - Dismiss`, {
      status,
      isBillingManager,
    });

    dismiss();
  };

  const handleAction = () => {
    track(`Payment Pending - Open portal`, {
      status,
      isBillingManager,
    });

    createCustomerPortal();
  };

  const buildCopy = () => {
    const leading =
      status === SubscriptionStatus.Unpaid
        ? 'There are some issues with your payment.'
        : 'Your payment was not yet approved.';

    const secondary = isBillingManager
      ? 'Please check your payment details if the problem persists.'
      : 'Please contact your team admin to check the payment details.';

    return `${leading} ${secondary}`;
  };

  React.useEffect(() => {
    if (isDismissed) {
      return;
    }

    track(`Payment Pending - Banner Shown`, {
      status,
      isBillingManager,
    });
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <MessageStripe
      variant="warning"
      corners="straight"
      onDismiss={handleDismiss}
    >
      {buildCopy()}
      {isBillingManager ? (
        <MessageStripe.Action
          loading={loadingCustomerPortal}
          onClick={handleAction}
        >
          Update payment
        </MessageStripe.Action>
      ) : null}
    </MessageStripe>
  );
};
