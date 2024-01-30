import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';

import { DuplicateAccount } from './components/DuplicateAccount';
import { ChooseProvider } from './ChooseProvider';
import { Onboarding } from './Onboarding';

import type { SignInMode } from './types';

interface SignInProps {
  onSignIn?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const {
    duplicateAccountStatus,
    pendingUser,
    pendingUserId,
    features,
  } = useAppState();
  const { getPendingUser } = useActions();

  useEffect(() => {
    if (pendingUserId) {
      getPendingUser();
    }
  }, [getPendingUser, pendingUserId]);

  const isAnyRegularAuthProviderAvailable =
    features.loginWithApple ||
    features.loginWithGithub ||
    features.loginWithGoogle;
  const defaultSignInMode: SignInMode =
    features.loginWithWorkos && !isAnyRegularAuthProviderAvailable
      ? 'SSO'
      : 'DEFAULT';

  if (duplicateAccountStatus) {
    return <DuplicateAccount provider={duplicateAccountStatus.provider} />;
  }

  if (pendingUser) {
    return <Onboarding />;
  }

  /**
   * ⬇️ Sign in provider
   */
  return (
    <ChooseProvider onSignIn={onSignIn} defaultSignInMode={defaultSignInMode} />
  );
};
