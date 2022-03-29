import { useState } from 'react';
import { useEffects } from 'app/overmind';

export type WorkspaceType = 'pro' | 'teamPro';
export type Interval = 'month' | 'year';
type Price = { currency: string; unitAmount: number };

export const formatCurrent = ({ currency, unitAmount }: Price) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency,
  });
  return formatter.format(unitAmount / 100);
};

export const useCreateCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { api } = useEffects();

  const createCheckout = async ({
    team_id,
    recurring_interval,
  }: Record<'team_id' | 'recurring_interval', string>) => {
    try {
      setLoading(true);

      const payload = await api.stripeCreateCheckout({
        success_path: '/dashboard/settings?success_upgrade=true',
        cancel_path: '/dashboard/settings?error_upgrade=true',
        team_id,
        recurring_interval,
      });

      setLoading(false);

      if (payload.stripeCheckoutUrl) {
        window.location.href = payload.stripeCheckoutUrl;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { loading, createCheckout };
};
