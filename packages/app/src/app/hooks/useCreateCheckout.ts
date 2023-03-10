import { useEffect, useState } from 'react';
import { useAppState, useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string };

type CheckoutOptions = {
  team_id: string | undefined;
  recurring_interval?: 'month' | 'year';
  success_path?: string;
  cancel_path?: string;
};

/**
 * @param {string} pathNameAndSearch The pathname and search params you want to add the stripe
 * success param to, for example  `/dashboard?workspace=xxxx`. Exclude the url base.
 */
const addStripeSuccessParam = (pathNameAndSearch: string): string => {
  try {
    const newUrl = new URL(pathNameAndSearch, window.location.origin);
    newUrl.searchParams.append('stripe', 'success');

    // Return only pathname and search
    return `${newUrl.pathname}${newUrl.search}`;
  } catch {
    return pathNameAndSearch;
  }
};

// TODO: replace useCreateCheckout usages
// with useGetCheckoutURL to remove the
// loading state when redirecting users
// to the checkout page.
export const useCreateCheckout = (): [
  CheckoutStatus,
  (args: CheckoutOptions) => void
] => {
  const [status, setStatus] = useState<CheckoutStatus>({ status: 'idle' });
  const { api } = useEffects();

  const createCheckout = async ({
    team_id,
    recurring_interval = 'month',
    success_path = dashboard.settings(team_id) + '&payment_pending=true',
    cancel_path = '/pro',
  }: CheckoutOptions) => {
    if (!team_id) {
      setStatus({ status: 'idle' });
      return;
    }

    try {
      setStatus({ status: 'loading' });

      const payload = await api.stripeCreateCheckout({
        success_path: addStripeSuccessParam(success_path),
        cancel_path,
        team_id,
        recurring_interval,
      });

      if (payload.stripeCheckoutUrl) {
        window.location.href = payload.stripeCheckoutUrl;
      }
    } catch (err) {
      setStatus({
        status: 'error',
        error: err?.message ?? 'Failed to create checkout link',
      });
    }
  };

  return [status, createCheckout];
};

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
