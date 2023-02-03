import { useState } from 'react';
import { useEffects, useAppState } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import track from '@codesandbox/common/lib/utils/analytics';

export const useUpgradeFromV1ToV2 = () => {
  const state = useAppState();
  const effects = useEffects();
  const [isLoading, setIsLoading] = useState(false);
  const updateSandbox = useEffects().api.updateSandbox;
  const canConvert = hasPermission(
    state.editor.currentSandbox?.authorization,
    'write_code'
  );

  return {
    loading: isLoading,
    canConvert,

    perform: async () => {
      setIsLoading(true);
      const sandboxId = state.editor.currentSandbox.id;

      track('Editor - Convert to Cloud Sandbox', { owned: canConvert });

      if (canConvert) {
        const alias = state.editor.currentSandbox.alias;

        await updateSandbox(sandboxId, {
          v2: true,
        });

        const sandboxV2Url = sandboxUrl({
          id: sandboxId,
          alias,
          isV2: true,
          query: {
            welcome: 'true',
          },
        });

        window.location.href = sandboxV2Url;
      } else {
        const forkedSandbox = await effects.api.forkSandbox(sandboxId, {
          v2: true,
          teamId: state.activeTeam,
        });

        const sandboxV2Url = sandboxUrl({
          id: forkedSandbox.id,
          alias: forkedSandbox.alias,
          isV2: true,
          query: {
            welcome: 'true',
          },
        });

        window.location.href = sandboxV2Url;
      }
    },
  };
};
