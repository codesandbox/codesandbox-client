import React from 'react';
import { MessageStripe } from '@codesandbox/components';
import { useUpgradeFromV1ToV2 } from 'app/hooks/useUpgradeFromV1ToV2';

export const UpgradeSSEToV2Stripe = () => {
  const { perform, loading, canConvert } = useUpgradeFromV1ToV2();

  return (
    <MessageStripe variant="primary">
      <span>
        This sandbox runs much faster in our new editor. Do you want to{' '}
        {canConvert ? 'convert' : 'fork'} it to a Cloud Sandbox?
      </span>
      <MessageStripe.Action loading={loading} onClick={perform}>
        Yes, Convert
      </MessageStripe.Action>
    </MessageStripe>
  );
};
