import React from 'react';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState } from 'app/overmind';
import { useLocation } from 'react-router-dom';

export const PaymentPending: React.FC = () => {
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

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
};
