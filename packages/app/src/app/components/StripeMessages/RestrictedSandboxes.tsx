import React, { useEffect } from 'react';
import { MessageStripe } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import track from '@codesandbox/common/lib/utils/analytics';

export const RestrictedSandboxes = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro, isFree } = useWorkspaceSubscription();

  useEffect(() => {
    track('Dashboard Sandbox Limit Reached - Display', { isFree, isAdmin });
  }, []);

  if (isAdmin && isPro) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        You reached the maximum amount of private Sandboxes in this workspace.
        Contact us to increase your limit.
        <MessageStripe.Action
          as="a"
          href="mailto:support@codesandbox.io?subject=Sandbox limit on Pro plan"
          onClick={() => {
            track('Dashboard Sandbox Limit Reached - Click contact us');
          }}
        >
          Contact us
        </MessageStripe.Action>
      </MessageStripe>
    );
  }

  if (isAdmin && isFree) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        You reached the maximum amount of private Sandboxes in this workspace.
        Upgrade to Pro to create more private Sandboxes.
        <MessageStripe.Action
          as="a"
          href={upgradeUrl({
            source: 'dashboard_restricted_sandboxes_banner',
            workspaceId: activeTeam,
          })}
          onClick={() => {
            track('Dashboard Sandbox Limit Reached - Click upgrade to pro');
          }}
        >
          Upgrade to Pro
        </MessageStripe.Action>
      </MessageStripe>
    );
  }

  if (!isAdmin && isPro) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        You reached the maximum amount of private Sandboxes in this workspace.
        Ask your administrator to increase the limit.
      </MessageStripe>
    );
  }

  if (!isAdmin && isFree) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        You reached the maximum amount of private Sandboxes in this workspace.
        To increase the limit, ask your administrator to upgrade to Pro.
      </MessageStripe>
    );
  }

  return null;
};
