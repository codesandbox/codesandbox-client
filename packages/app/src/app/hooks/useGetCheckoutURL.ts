import { useCallback, useEffect, useState } from 'react';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { logError } from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useEffects } from 'app/overmind';
import { CheckoutOptions, addStripeSuccessParam } from './useCreateCheckout';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

const FALLBACK_URL = '/pro';

/**
 * useGetCheckoutURL checks if the current user can perform the checkout action,
 * which is either if they are an admin or if they are eligible for a trial. If
 * they are allowed, it returns the stripe url, otherwise it returns null.
 */
export const useGetCheckoutURL = ({
  success_path,
  cancel_path = '/pro',
  recurring_interval = 'month',
}: Omit<CheckoutOptions, 'team_id'>): string | null => {
  const { activeTeam } = useAppState();
  const { api } = useEffects();
  const { isEligibleForTrial, isFree } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();

  const canCheckout = (isFree && isBillingManager) || isEligibleForTrial;
  const [url, setUrl] = useState<string>(FALLBACK_URL);

  const getCheckoutUrl = useCallback(
    async (teamId: string) => {
      try {
        const payload = await api.stripeCreateCheckout({
          success_path: addStripeSuccessParam(
            success_path ??
              `${dashboard.settings(teamId)} + '&payment_pending=true'`
          ),
          cancel_path,
          team_id: teamId,
          recurring_interval,
        });

        if (payload.stripeCheckoutUrl) {
          setUrl(payload.stripeCheckoutUrl);
        }
      } catch (error) {
        logError(error);
      }
    },
    [api, cancel_path, recurring_interval, success_path]
  );

  useEffect(() => {
    if (canCheckout && activeTeam) {
      getCheckoutUrl(activeTeam);
    }
  }, [activeTeam, canCheckout, getCheckoutUrl]);

  return canCheckout ? url : null;
};
