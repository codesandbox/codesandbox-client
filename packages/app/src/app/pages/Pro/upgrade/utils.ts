import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

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

export const useCreateCheckout = (): [
  boolean,
  (arg: Record<'team_id' | 'recurring_interval', string>) => void
] => {
  const [loading, setLoading] = useState(false);
  const { api } = useEffects();

  const createCheckout = async ({
    team_id,
    recurring_interval,
  }: Record<'team_id' | 'recurring_interval', string>) => {
    try {
      setLoading(true);

      const payload = await api.stripeCreateCheckout({
        success_path: '/dashboard/settings?payment_pending=true',
        cancel_path: '/pro',
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

  return [loading, createCheckout];
};

export const useCreateCustomerPortal = (
  activeTeam: string
): [boolean, () => void] => {
  const [loading, setLoading] = useState(false);
  const { api } = useEffects();

  const createCustomerPortal = async () => {
    setLoading(true);
    const payload = await api.stripeCustomerPortal(
      activeTeam,
      dashboard.settings(activeTeam)
    );

    if (payload.stripeCustomerPortalUrl) {
      window.location.href = payload.stripeCustomerPortalUrl;
    }

    setLoading(false);
  };

  return [loading, createCustomerPortal];
};
