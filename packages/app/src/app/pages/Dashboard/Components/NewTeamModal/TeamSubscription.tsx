import React from 'react';

import { Text } from '@codesandbox/components';
import { useCreateCheckout } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';

export const TeamSubscription: React.FC<{ onComplete: () => void }> = () => {
  const [checkout, createCheckout] = useCreateCheckout();

  React.useEffect(() => {
    if (checkout.status !== 'idle') {
      return;
    }

    createCheckout({
      utm_source: 'settings_upgrade',
    });

    track('New Workspace - Create Checkout', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, [checkout.status]);

  if (checkout.status === 'loading') {
    return <Text>Loading...</Text>;
  }

  return null;
};
