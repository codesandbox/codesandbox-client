import React, { useEffect } from 'react';
import { MessageStripe } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import track from '@codesandbox/common/lib/utils/analytics';

export const DraftsLimit = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();

  useEffect(() => {
    track('Dashboard Draft Limit Reached - Display', { isAdmin });
  }, []);

  if (isAdmin) {
    return (
      <MessageStripe variant="warning" justify="space-between">
        Your Drafts folder is full. Delete unneeded drafts, or upgrade to Pro
        for unlimited drafts.
        <MessageStripe.Action
          as="a"
          href={upgradeUrl({
            source: 'dashboard_drafts_limit_banner',
            workspaceId: activeTeam,
          })}
          onClick={() => {
            track('Dashboard Draft Limit Reached - Click upgrade to pro');
          }}
        >
          Upgrade to Pro
        </MessageStripe.Action>
      </MessageStripe>
    );
  }

  return (
    <MessageStripe variant="warning" justify="space-between">
      Your Drafts folder is full. Delete unneeded drafts, or ask admin to
      upgrade to Pro for unlimited drafts.
    </MessageStripe>
  );
};
