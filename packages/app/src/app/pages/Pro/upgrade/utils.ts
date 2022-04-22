import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

export type WorkspaceType = 'pro' | 'teamPro';
export type Interval = 'month' | 'year';

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
        success_path: dashboard.settings(team_id) + '&payment_pending=true',
        cancel_path: '/pro',
        team_id,
        recurring_interval,
      });

      if (payload.stripeCheckoutUrl) {
        window.location.href = payload.stripeCheckoutUrl;
      }
    } catch (err) {
      setLoading(false);
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
    try {
      setLoading(true);
      const payload = await api.stripeCustomerPortal(
        activeTeam,
        dashboard.settings(activeTeam)
      );

      if (payload.stripeCustomerPortalUrl) {
        window.location.href = payload.stripeCustomerPortalUrl;
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return [loading, createCustomerPortal];
};
