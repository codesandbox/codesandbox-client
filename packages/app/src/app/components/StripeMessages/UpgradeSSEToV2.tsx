import React from 'react';
import { useEffects, useAppState } from 'app/overmind';
import { MessageStripe } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

export const UpgradeSSEToV2Stripe = () => {
  const state = useAppState();
  const updateSandbox = useEffects().api.updateSandbox;

  return (
    <MessageStripe variant="primary">
      <span>
        This sandbox runs much faster in our new Editor. Do you want to convert
        it to a Cloud Sandbox?
      </span>
      <MessageStripe.Action
        onClick={async () => {
          const sandboxId = state.editor.currentSandbox.id;
          const alias = state.editor.currentSandbox.alias;

          await updateSandbox(sandboxId, {
            v2: true,
          });

          const sandboxV2Url = sandboxUrl({
            id: sandboxId,
            alias,
            isV2: true,
          });

          window.location.href = sandboxV2Url;
        }}
      >
        Yes, Convert
      </MessageStripe.Action>
    </MessageStripe>
  );
};
