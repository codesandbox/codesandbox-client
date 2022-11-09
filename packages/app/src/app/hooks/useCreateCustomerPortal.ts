import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

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
