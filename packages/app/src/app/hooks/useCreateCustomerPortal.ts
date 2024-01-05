import { useState } from 'react';
import { useEffects } from 'app/overmind';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

type CheckoutOptions = {
  team_id?: string;
  return_path?: string;
};

export const useCreateCustomerPortal = ({
  team_id,
  return_path,
}: CheckoutOptions): [boolean, () => void] => {
  const [loading, setLoading] = useState(false);
  const { api } = useEffects();

  const createCustomerPortal = async () => {
    if (!team_id) {
      return;
    }

    try {
      setLoading(true);
      const payload = await api.stripeCustomerPortal(
        team_id,
        return_path ?? dashboard.portalRelativePath(team_id)
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
