import React from 'react';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState } from 'app/overmind';
import { useLocation } from 'react-router-dom';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

export const PaymentPending: React.FC = () => {
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

  if (isTeamAdmin) {
    return (
      <MessageStripe variant="warning">
        There are some issues with your payment. Please update your payment
        details.
        <MessageStripe.Action
          loading={loadingCustomerPortal}
          onClick={createCustomerPortal}
        >
          Update payment
        </MessageStripe.Action>
      </MessageStripe>
    );
  }
  return (
    <MessageStripe variant="warning">
      There are some issues with your payment. Please contact your team admin to
      update your payment details.
    </MessageStripe>
  );
};
