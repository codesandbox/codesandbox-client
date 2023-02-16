import React from 'react';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState } from 'app/overmind';
import { useLocation } from 'react-router-dom';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const PaymentPending: React.FC = () => {
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { hasExpiredTeamTrial } = useWorkspaceSubscription();
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

  const buildCopy = () => {
    const description = {
      trial: 'Your free trial has expired',
      default: 'There are some issues with your payment',
    };
    const action = {
      admin: 'Please update your payment details',
      default: 'Please contact your team admin to update the payment details',
    };

    return `${hasExpiredTeamTrial ? description.trial : description.default}. ${
      isTeamAdmin ? action.admin : action.default
    }.`;
  };

  return (
    <MessageStripe variant="warning">
      {buildCopy()}
      {isTeamAdmin ? (
        <MessageStripe.Action
          loading={loadingCustomerPortal}
          onClick={createCustomerPortal}
        >
          Update payment
        </MessageStripe.Action>
      ) : null}{' '}
    </MessageStripe>
  );
};
