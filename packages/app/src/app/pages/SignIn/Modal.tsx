import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Element, Stack } from '@codesandbox/components';

import { Wrapper } from './components/Wrapper';
import { DuplicateAccount } from './components/DuplicateAccount';
import { ChooseProvider } from './ChooseProvider';
import { Onboarding } from './Onboarding';

import '../WaitList/fonts/index.css';

type SignInModalElementProps = {
  redirectTo?: string;
  onSignIn?: () => void;
};

export const SignInModalElement = ({
  redirectTo,
  onSignIn,
}: SignInModalElementProps) => {
  const { duplicateAccountStatus, pendingUser, pendingUserId } = useAppState();
  const { getPendingUser } = useActions();

  useEffect(() => {
    if (pendingUserId) {
      getPendingUser();
    }
  }, [getPendingUser, pendingUserId]);

  if (duplicateAccountStatus) {
    return (
      <Wrapper>
        <DuplicateAccount provider={duplicateAccountStatus.provider} />
      </Wrapper>
    );
  }

  /**
   * 🚧 Utility to debug Trial Onboarding Questions
   */
  const TOQ_DEBUG = window.localStorage.getItem('TOQ_DEBUG') === 'ENABLED';

  // 🚧 Remove || TOQ_DEBUG
  if (pendingUser || TOQ_DEBUG) {
    return (
      <Wrapper>
        <Stack direction="vertical" gap={64}>
          <Element paddingBottom={6}>Welcome</Element>
          <Onboarding />
        </Stack>
      </Wrapper>
    );
  }

  /**
   * ⬇️ Sign in provider
   */
  return (
    <Wrapper>
      <ChooseProvider redirectTo={redirectTo} onSignIn={onSignIn} />
    </Wrapper>
  );
};
