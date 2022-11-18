import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe, Text } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

export const FreeViewOnlyStripe = () => {
  const { isTeamAdmin } = useWorkspaceAuthorization();

  return (
    <MessageStripe>
      {isTeamAdmin ? (
        <span>
          You are no longer in a <Text weight="bold">PRO account</Text>. This
          sandbox is in view mode only. Upgrade your account for unlimited
          sandboxes.
        </span>
      ) : (
        <span>
          You are no longer in a <Text weight="bold">PRO team</Text>. This
          sandbox is in view mode only, contact your team admin to upgrade.
        </span>
      )}
      {isTeamAdmin ? (
        <MessageStripe.Action
          as="a"
          href="/pro"
          onClick={() => {
            track('Limit banner: editor - Upgrade', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
        >
          Upgrade now
        </MessageStripe.Action>
      ) : null}
    </MessageStripe>
  );
};
