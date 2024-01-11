import React from 'react';

import { MessageStripe } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useScopedPersistedState } from 'app/hooks/usePersistedState';

const SANDBOX_INCREASE_LIMIT_REQUEST_FORM =
  'https://webforms.pipedrive.com/f/cB3DfL4Vg41gVPKuA6MLRpr8YI6L8KCzxiulfpjgnBdFBxa4xkJpqMSE6g8yHTjjtF';
const SANDBOX_LIMIT_ANNOUNCEMENT = 'https://www.codesandbox.community/c/api-billing-updates/upcoming-pricing-billing-changes';

export const SandboxLimitation: React.FC = () => {
  const { activeTeam } = useAppState();
  const { hasOver20Sandboxes, hasOver200Sandboxes } = useWorkspaceLimits();
  const [
    sandboxBannerDismissed,
    setSandboxBannerDismissed,
  ] = useScopedPersistedState('SANDBOX_BANNER_DISMISSED', false, activeTeam);

  const handleDismiss = () => {
    setSandboxBannerDismissed(true);
  };

  const buildCopy = () => {
    if (hasOver200Sandboxes) {
      return 'Starting on Jan 30th, your Free plan will be limited to 20 sandboxes. Request an increase to avoid disruption to your service.';
    }

    if (hasOver20Sandboxes) {
      return 'Starting on Jan 30th, your Free plan will be limited to 20 sandboxes. Take action to avoid disruption to your service.';
    }

    return `Starting on Jan 30th, your Free plan will be limited to 20 sandboxes.`;
  };

  const buildAction = () => {
    if (hasOver200Sandboxes) {
      return (
        <MessageStripe.Action
          as="a"
          target="_blank"
          rel="noreferrer noopener"
          href={SANDBOX_INCREASE_LIMIT_REQUEST_FORM}
        >
          Request an increase
        </MessageStripe.Action>
      );
    }

    return (
      <MessageStripe.Action
        as="a"
        target="_blank"
        rel="noreferrer noopener"
        href={SANDBOX_LIMIT_ANNOUNCEMENT}
      >
        Learn more
      </MessageStripe.Action>
    );
  };

  if (sandboxBannerDismissed) {
    return null;
  }

  return (
    <MessageStripe
      variant={hasOver20Sandboxes ? 'warning' : 'info'}
      corners="straight"
      onDismiss={handleDismiss}
      justify="center"
    >
      {buildCopy()}
      {buildAction()}
    </MessageStripe>
  );
};
