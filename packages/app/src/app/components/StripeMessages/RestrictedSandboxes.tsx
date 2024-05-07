import React, { useEffect } from 'react';
import { MessageStripe } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';

export const RestrictedSandboxes = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro, isFree } = useWorkspaceSubscription();
  const { privateSandboxLimit } = useWorkspaceLimits();

  useEffect(() => {
    track('Dashboard Sandbox Limit Reached - Display', { isFree, isAdmin });
  }, []);

  if (isAdmin && isPro) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        You have reached the free limit of {privateSandboxLimit} private
        Sandboxes. Contact us to increase your limit.
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
        You have reached the free limit of {privateSandboxLimit} private
        Sandboxes. Upgrade to Pro to create more private Sandboxes.
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
        You have reached the free limit of {privateSandboxLimit} private
        Sandboxes. Ask your administrator to increase the limit.
      </MessageStripe>
    );
  }

  if (!isAdmin && isFree) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        You have reached the free limit of {privateSandboxLimit} private
        Sandboxes. To increase the limit, ask your administrator to upgrade to
        Pro.
      </MessageStripe>
    );
  }

  return null;
};
