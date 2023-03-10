import { useEffect, useState } from 'react';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useAppState, useEffects } from 'app/overmind';
import { CheckoutOptions, addStripeSuccessParam } from './useCreateCheckout';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

const FALLBACK_URL = '/pro';

type CheckoutState =
  | { state: 'IDLE'; defaultUrl: string }
  | {
      state: 'READY';
      url: string;
    }
  | { state: 'LOADING'; defaultUrl: string }
  | { state: 'ERROR'; defaultUrl: string; error: string };

/**
 * useGetCheckoutURL checks if the current user can perform the checkout action,
 * which is either if they are an admin or if they are eligible for a trial. If
 * they are allowed, it returns explicit states, otherwise it returns null.
 */
export const useGetCheckoutURL = ({
  success_path,
  cancel_path = '/pro',
  recurring_interval = 'month',
}: Omit<CheckoutOptions, 'team_id'>): CheckoutState | null => {
  const { activeTeam } = useAppState();
  const { api } = useEffects();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isAdmin } = useWorkspaceAuthorization();

  const canCheckout = useState(isAdmin || isEligibleForTrial);
  const [checkout, setCheckout] = useState<CheckoutState>({
    state: 'IDLE',
    defaultUrl: FALLBACK_URL,
  });

  const getCheckoutUrl = async (teamId: string) => {
    try {
      setCheckout({
        state: 'LOADING',
        defaultUrl: FALLBACK_URL,
      });

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
        setCheckout({
          state: 'READY',
          url: payload.stripeCheckoutUrl,
        });
      }
    } catch (error) {
      setCheckout({
        state: 'ERROR',
        error:
          JSON.stringify(error?.message || error) ??
          'Failed to get checkout URL.',
        defaultUrl: FALLBACK_URL,
      });
    }
  };

  useEffect(() => {
    if (canCheckout && activeTeam) {
      getCheckoutUrl(activeTeam);
    }
  }, [activeTeam, canCheckout]);

  return canCheckout ? checkout : null;
};
