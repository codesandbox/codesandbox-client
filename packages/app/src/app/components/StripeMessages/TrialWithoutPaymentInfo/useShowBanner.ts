import React from 'react';
import { useAppState, useEffects } from 'app/overmind';
import { isBefore, startOfToday } from 'date-fns';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const useShowBanner = (): [boolean, () => void] => {
  const { activeTeam } = useAppState();
  const {
    browser: { storage },
  } = useEffects();
  const { hasActiveTeamTrial, hasPaymentMethod } = useWorkspaceSubscription();

  const hasTrialWithoutPaymentInfo = hasActiveTeamTrial && !hasPaymentMethod;

  const storageKey = `TRIAL_PAYMENT_INFO_REMINDER_${activeTeam}`;

  const today = startOfToday();
  const dismissedBannerAt = storage.get(storageKey)
    ? new Date(storage.get(storageKey))
    : null;

  const [showBanner, setShowBanner] = React.useState<boolean>(
    dismissedBannerAt ? isBefore(dismissedBannerAt, today) : true
  );

  const dismissBanner = () => {
    track('Stripe banner - active trial dismiss payment reminder', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    storage.set(storageKey, today);
    setShowBanner(false);
  };

  return [hasTrialWithoutPaymentInfo && showBanner, dismissBanner];
};
