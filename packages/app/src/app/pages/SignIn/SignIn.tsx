import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';

import { DuplicateAccount } from './components/DuplicateAccount';
import { ChooseProvider } from './ChooseProvider';
import { Onboarding } from './Onboarding';

import type { SignInMode } from './types';

interface SignInProps {
  redirectTo?: string;
  onSignIn?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ redirectTo, onSignIn }) => {
  const { duplicateAccountStatus, pendingUser, pendingUserId } = useAppState();
  const { getPendingUser } = useActions();

  useEffect(() => {
    if (pendingUserId) {
      getPendingUser();
    }
  }, [getPendingUser, pendingUserId]);

  const defaultSignInMode: SignInMode =
    new URLSearchParams(location.search).get('sso_mode') === 'true'
      ? 'SSO'
      : 'DEFAULT';

  /**
   * 🚧 Utility to debug Duplicate Account
   */
  const DA_DEBUG = window.localStorage.getItem('DA_DEBUG') === 'ENABLED';

  // 🚧 Remove || DA_DEBUG
  if (duplicateAccountStatus || DA_DEBUG) {
    // 🚧 Remove
    return DA_DEBUG ? (
      <DuplicateAccount provider={'google'} />
    ) : (
      // 🚧 Keep this (return)
      <DuplicateAccount provider={duplicateAccountStatus.provider} />
    );
  }

  /**
   * 🚧 Utility to debug Trial Onboarding Questions
   */
  const TOQ_DEBUG = window.localStorage.getItem('TOQ_DEBUG') === 'ENABLED';

  // 🚧 Remove || TOQ_DEBUG
  if (pendingUser || TOQ_DEBUG) {
    return <Onboarding />;
  }

  /**
   * ⬇️ Sign in provider
   */
  return (
    <ChooseProvider
      redirectTo={redirectTo}
      onSignIn={onSignIn}
      defaultSignInMode={defaultSignInMode}
    />
  );
};
