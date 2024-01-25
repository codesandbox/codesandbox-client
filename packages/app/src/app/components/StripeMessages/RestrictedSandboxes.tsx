import React from 'react';
import { MessageStripe } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const RestrictedSandboxes = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro, isFree } = useWorkspaceSubscription();

  if (isAdmin && isPro) {
    return (
      <MessageStripe variant="info" justify="space-between">
        You reached the maximum amount of shareable Sandboxes in this workspace.
        Contact us to increase your limit.
        <MessageStripe.Action
          as="a"
          href="mailto:support@codesandbox.io?subject=Sandbox limit on Pro plan"
        >
          Contact us
        </MessageStripe.Action>
      </MessageStripe>
    );
  }

  if (isAdmin && isFree) {
    return (
      <MessageStripe variant="info" justify="space-between">
        You reached the maximum amount of shareable Sandboxes in this workspace.
        Upgrade to Pro to create more shareable Sandboxes.
        <MessageStripe.Action
          as="a"
          href={proUrl({
            source: 'dashboard_restricted_sandboxes_banner',
            workspaceId: activeTeam,
            ubbBeta: true,
          })}
        >
          Upgrade to Pro
        </MessageStripe.Action>
      </MessageStripe>
    );
  }

  if (!isAdmin && isPro) {
    return (
      <MessageStripe variant="info" justify="space-between">
        You reached the maximum amount of shareable Sandboxes in this workspace.
        Ask your administrator to increase the limit.
      </MessageStripe>
    );
  }

  if (!isAdmin && isFree) {
    return (
      <MessageStripe variant="info" justify="space-between">
        You reached the maximum amount of shareable Sandboxes in this workspace.
        To increase the limit, ask your administrator to upgrade to Pro.
      </MessageStripe>
    );
  }

  return null;
};
