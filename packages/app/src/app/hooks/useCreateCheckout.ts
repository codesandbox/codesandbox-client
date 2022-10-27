import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string };

type CheckoutOptions = {
  team_id: string;
  recurring_interval: string;
  success_path?: string;
  cancel_path?: string;
};

export const useCreateCheckout = (): [
  CheckoutStatus,
  (args: CheckoutOptions) => void
] => {
  const [status, setStatus] = useState<CheckoutStatus>({ status: 'idle' });
  const { api } = useEffects();

  const createCheckout = async ({
    team_id,
    recurring_interval,
    success_path = dashboard.settings(team_id) + '&payment_pending=true',
    cancel_path = '/pro',
  }: CheckoutOptions) => {
    try {
      setStatus({ status: 'loading' });

      const payload = await api.stripeCreateCheckout({
        success_path,
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
