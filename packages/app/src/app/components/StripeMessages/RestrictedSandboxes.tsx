import React from 'react';
import { MessageStripe } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const RestrictedSandboxes = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro } = useWorkspaceSubscription();

  const text = isPro
    ? 'You reached the max amount of shareable Sandboxes. To create more, buy an add-on for your Pro subscription.'
    : 'You reached the max amount of shareable Sandboxes for the Free workspace. Upgrade to Pro to create more Sandboxes.';

  const cta = isPro ? 'Buy add-on' : 'Upgrade to Pro';

  return (
    <MessageStripe variant="warning" justify="space-between">
      {text}
      {isAdmin ? (
        <MessageStripe.Action
          as="a"
          href={proUrl({
            source: 'dashboard_restricted_sandboxes_banner',
            workspaceId: activeTeam,
            ubbBeta: true,
          })}
        >
          {cta}
        </MessageStripe.Action>
      ) : null}
    </MessageStripe>
  );
};
