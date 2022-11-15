import { useEffect, useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

type CheckoutStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string };

type CheckoutOptions = {
  team_id: string | undefined;
  recurring_interval?: string;
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

type CheckoutState =
  | { state: 'IDLE' }
  | {
      state: 'READY';
      url: string;
    }
  | { state: 'LOADING' }
  | { state: 'ERROR'; error: string };

// TODO: replace useCreateCheckout usages
// with useGetCheckoutURL to remove the
// loading state when redirecting users
// to the checkout page.
export const useGetCheckoutURL = ({
  team_id,
  success_path = dashboard.settings(team_id) + '&payment_pending=true',
  cancel_path = '/pro',
  recurring_interval = 'month',
}: CheckoutOptions): CheckoutState => {
  const [checkout, setCheckout] = useState<CheckoutState>({ state: 'IDLE' });
  const { api } = useEffects();

  const getCheckoutUrl = async () => {
    if (!team_id) {
      setCheckout({
        state: 'IDLE',
      });

      return;
    }

    try {
      setCheckout({
        state: 'LOADING',
      });

      const payload = await api.stripeCreateCheckout({
        success_path,
        cancel_path,
        team_id,
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
          JSON.stringify(error?.messagge || error) ??
          'Failed to get checkout URL.',
      });
    }
  };

  useEffect(() => {
    getCheckoutUrl();
  }, [team_id]);

  return checkout;
};
