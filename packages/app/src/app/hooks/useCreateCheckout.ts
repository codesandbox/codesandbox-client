import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string };

export const useCreateCheckout = (): [
  CheckoutStatus,
  (arg: Record<'team_id' | 'recurring_interval', string>) => void
] => {
  const [status, setStatus] = useState<CheckoutStatus>({ status: 'idle' });
  const { api } = useEffects();

  const createCheckout = async ({
    team_id,
    recurring_interval,
  }: Record<'team_id' | 'recurring_interval', string>) => {
    try {
      setStatus({ status: 'loading' });

      const payload = await api.stripeCreateCheckout({
        success_path: dashboard.settings(team_id) + '&payment_pending=true',
        cancel_path: '/pro',
        team_id,
        recurring_interval,
      });

      if (payload.stripeCheckoutUrl) {
        window.location.href = payload.stripeCheckoutUrl;
      }
    } catch (err) {
      setStatus({
        status: 'error',
        error: err?.message ?? 'Failed to create checkout link.',
      });
    }
  };

  return [status, createCheckout];
};
