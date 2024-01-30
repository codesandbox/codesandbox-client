import React from 'react';
import { MessageStripe, Text } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const RestrictedSandbox = () => {
  const { activeTeam, editor } = useAppState();
  const { sandboxPrivacyChanged } = useActions().workspace;
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro } = useWorkspaceSubscription();

  const changeToPrivate = () => {
    sandboxPrivacyChanged({ privacy: 2, source: 'editor-restricted-stripe' });
  };

  if (editor.currentSandbox.draft) {
    // Draft sandboxes restricted if not private
    return (
      <MessageStripe variant="error" corners="straight">
        From Jan 30th, all draft Sandboxes need to be private. To edit this
        draft Sandbox, make it private. (it will become non-shareable and
        non-embeddable).
        <MessageStripe.Action onClick={changeToPrivate}>
          Make this Sandbox private
        </MessageStripe.Action>
      </MessageStripe>
    );
  }

  const restrictedBaseText =
    'This Sandbox is restricted, because your workspace is over its Sandbox limit.';

  if (isPro) {
    return (
      <MessageStripe variant="error" corners="straight">
        <Text>
          {restrictedBaseText}{' '}
          {isAdmin
            ? 'Contact us to increase your limit.'
            : 'Ask your administrator to increase the limit.'}
        </Text>
        {isAdmin ? (
          <MessageStripe.Action
            as="a"
            href="mailto:support@codesandbox.io?subject=Sandbox limit on Pro plan"
          >
            Contact us
          </MessageStripe.Action>
        ) : null}
      </MessageStripe>
    );
  }

  // Sandbox restricted because of workspace limits
  return (
    <MessageStripe variant="error" corners="straight">
      <Text>
        {restrictedBaseText}{' '}
        {isAdmin
          ? 'To increase the limit, upgrade to Pro.'
          : 'To increase the limit, ask your administrator to upgrade to Pro.'}
      </Text>
      {isAdmin ? (
        <MessageStripe.Action
          as="a"
          href={upgradeUrl({
            source: 'v1_editor_restricted_sandbox_banner',
            workspaceId: activeTeam,
          })}
        >
          Upgrade to Pro
        </MessageStripe.Action>
      ) : null}
    </MessageStripe>
  );
};
