import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState } from 'app/overmind';
import React from 'react';

import { SubscriptionType } from 'app/graphql/types';
import { Actions } from './Actions';
import { AppMenu } from './AppMenu';
import { SandboxName } from './SandboxName';
import { WorkspaceName } from './WorkspaceName';
import { SignInBanner } from './SignInAd';

export const Header = () => {
  const { editor, isAuthenticating, activeTeamInfo, user } = useAppState();

  const renderWorkspace = () => {
    if (user && activeTeamInfo) {
      return (
        <WorkspaceName
          showFreeBadge
          name={user.name}
          plan={activeTeamInfo.subscription.type}
        />
      );
    }

    if (editor.currentSandbox?.author) {
      const { author } = editor.currentSandbox;
      const name = author.name;
      const plan = author.subscriptionPlan as SubscriptionType;

      return <WorkspaceName name={name} plan={plan} />;
    }

    return null;
  };

  return (
    <>
      {!user && <SignInBanner />}
      <Stack
        as="header"
        justify="space-between"
        align="center"
        paddingX={2}
        css={css({
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          height: 12,
          backgroundColor: 'titleBar.activeBackground',
          color: 'titleBar.activeForeground',
          borderBottom: '1px solid',
          borderColor: 'titleBar.border',
        })}
      >
        <Stack align="center">
          <AppMenu />
          {renderWorkspace()}
        </Stack>

        {editor.currentSandbox && !isAuthenticating ? <SandboxName /> : null}
        {editor.currentSandbox && !isAuthenticating ? <Actions /> : null}
      </Stack>
    </>
  );
};
