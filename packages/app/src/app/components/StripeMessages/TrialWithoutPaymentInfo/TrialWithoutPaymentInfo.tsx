import React from 'react';
import { useLocation } from 'react-router-dom';
import { differenceInDays, startOfToday } from 'date-fns';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import track from '@codesandbox/common/lib/utils/analytics';
import { pluralize } from 'app/utils/pluralize';

export const TrialWithoutPaymentInfo: React.FC<{ onDismiss: () => void }> = ({
  onDismiss,
}) => {
  const { activeTeam } = useAppState();
  const { pathname } = useLocation();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { subscription } = useWorkspaceSubscription();
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

  const today = startOfToday();
  const trialEndDate = new Date(subscription?.trialEnd);
  const remainingTrialDays = differenceInDays(trialEndDate, today);

  const handleAction = () => {
    track('Stripe banner - active trial add payment details', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    createCustomerPortal();
  };

  const buildCopy = () => {
    const firstSentence =
      remainingTrialDays === 0
        ? 'Your trial expires today'
        : `Your trial will expire in ${remainingTrialDays} ${pluralize({
            word: 'day',
            count: remainingTrialDays,
          })}`;

    if (isBillingManager) {
      return `${firstSentence}. Add your payment details to continue with your subscription.`;
    }

    return `${firstSentence}. Contact your team admin to add the payment details.`;
  };

  React.useEffect(() => {
    track('Stripe banner - active trial seen payment reminder', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  return (
    <MessageStripe corners="straight" variant="trial" onDismiss={onDismiss}>
      {buildCopy()}
      {isBillingManager ? (
        <MessageStripe.Action
          loading={loadingCustomerPortal}
          onClick={handleAction}
        >
          Add payment details
        </MessageStripe.Action>
      ) : null}
    </MessageStripe>
  );
};
