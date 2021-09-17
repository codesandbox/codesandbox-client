import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState } from 'app/overmind';
import React, { useState, useEffect } from 'react';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';

import { Actions } from './Actions';
import { AppMenu } from './AppMenu';
import { SandboxName } from './SandboxName';
import { WorkspaceName } from './WorkspaceName';
import { SignInBanner } from './SignInAd';

export const Header = () => {
  const { editor, isAuthenticating, activeTeamInfo, user } = useAppState();

  /**
   * A/B
   */
  const experimentPromise = useExperimentResult('fixed-signin-banner');
  const [newSignInBanner, setNewSignInBanner] = useState(false);
  useEffect(() => {
    /* Wait for the API */
    experimentPromise.then(experiment => {
      if (experiment === ExperimentValues.A) {
        /**
         * A
         */
        setNewSignInBanner(false);
      } else if (experiment === ExperimentValues.B) {
        /**
         * B
         */
        setNewSignInBanner(true);
      }
    });
  }, [experimentPromise]);

  const renderWorkspace = () => {
    if (activeTeamInfo) {
      return (
        <WorkspaceName
          name={activeTeamInfo.name}
          plan={activeTeamInfo.subscription?.type}
        />
      );
    }

    return <WorkspaceName showBadge={false} name="CodeSandbox" />;
  };

  return (
    <>
      {!user && !newSignInBanner && <SignInBanner />}
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
