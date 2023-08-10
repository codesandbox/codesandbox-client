import React from 'react';
import styled from 'styled-components';
import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe, Text } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';

const LinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: inherit;
  font-family: 'Inter', sans-serif;
  text-decoration: underline;

  &:hover {
    color: white;
  }
`;

export const FreeViewOnlyStripe = () => {
  const { activeTeam } = useAppState();
  const { sandboxPrivacyChanged } = useActions().workspace;
  const { isPersonalSpace, isBillingManager } = useWorkspaceAuthorization();

  const changeToPublic = () => {
    sandboxPrivacyChanged({ privacy: 0, source: 'editor-view-only-stripe' });
  };

  return (
    <MessageStripe>
      <span>
        You no longer have a <Text weight="bold">Pro</Text> subscription. This
        sandbox is in view mode only.{' '}
        <LinkButton onClick={changeToPublic}>Make it public</LinkButton> or
        upgrade to <Text weight="bold">Pro</Text>.
      </span>
      {isPersonalSpace || isBillingManager ? (
        <MessageStripe.Action
          as="a"
          href={proUrl({
            source: 'v1_sandbox_view_only_upgrade',
            workspaceId: activeTeam,
          })}
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
