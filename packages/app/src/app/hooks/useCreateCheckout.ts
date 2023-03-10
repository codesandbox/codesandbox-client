import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string };

export type CheckoutOptions = {
  team_id: string | undefined;
  recurring_interval?: 'month' | 'year';
  success_path?: string;
  cancel_path?: string;
};

/**
 * @param {string} pathNameAndSearch The pathname and search params you want to add the stripe
 * success param to, for example  `/dashboard?workspace=xxxx`. Exclude the url base.
 */
export const addStripeSuccessParam = (pathNameAndSearch: string): string => {
  try {
    const newUrl = new URL(pathNameAndSearch, window.location.origin);
    newUrl.searchParams.append('stripe', 'success');

    // Return only pathname and search
    return `${newUrl.pathname}${newUrl.search}`;
  } catch {
    return pathNameAndSearch;
  }
};

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
