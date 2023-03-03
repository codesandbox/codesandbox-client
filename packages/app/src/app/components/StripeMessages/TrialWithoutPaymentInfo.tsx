import React from 'react';
import { useLocation } from 'react-router-dom';
import { differenceInDays, isBefore, startOfToday } from 'date-fns';

import { MessageStripe } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useAppState, useEffects } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import track from '@codesandbox/common/lib/utils/analytics';
import { pluralize } from 'app/utils/pluralize';

export const TrialWithoutPaymentInfo: React.FC = () => {
  const { activeTeam } = useAppState();
  const {
    browser: { storage },
  } = useEffects();
  const { pathname } = useLocation();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { subscription } = useWorkspaceSubscription();
  const [
    loadingCustomerPortal,
    createCustomerPortal,
  ] = useCreateCustomerPortal({ team_id: activeTeam, return_path: pathname });

  const storageKey = `TRIAL_PAYMENT_INFO_REMINDER_${activeTeam}`;

  const dismissedBannerAt = storage.get(storageKey)
    ? new Date(storage.get(storageKey))
    : null;

  const today = startOfToday();
  const trialEndDate = new Date(subscription?.trialEnd);
  const remainingTrialDays = differenceInDays(trialEndDate, today);

  const [showBanner, setShowBanner] = React.useState<boolean>(
    dismissedBannerAt ? isBefore(dismissedBannerAt, today) : true
  );

  const handleDismiss = () => {
    track('Stripe banner - active trial dismiss payment reminder', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    storage.set(storageKey, today);
    setShowBanner(false);
  };

  const handleAction = () => {
    track('Stripe banner - active trial add payment details', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    createCustomerPortal();
  };

  const buildCopy = () => {
    const firstSentence = `Your trial will expire in ${remainingTrialDays} ${pluralize(
      { word: 'day', count: remainingTrialDays }
    )}.`;

    if (isTeamAdmin) {
      return `${firstSentence} Add your payment details to continue with your subscription.`;
    }

    return `${firstSentence}. Contact your team admin to add the payment details.`;
  };

  React.useEffect(() => {
    if (!showBanner) {
      return;
    }

    track('Stripe banner - active trial dismiss payment reminde', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <MessageStripe corners="straight" variant="trial" onDismiss={handleDismiss}>
      {buildCopy()}
      {isTeamAdmin ? (
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
