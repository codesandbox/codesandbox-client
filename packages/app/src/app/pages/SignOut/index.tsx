import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { useAppState, useActions } from 'app/overmind';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

export const SignOut = () => {
  const state = useAppState();
  const { signOutClicked } = useActions();

  useEffect(() => {
    signOutClicked();
  }, [signOutClicked]);

  if (!state.hasLogIn) {
    return <Redirect to={signInPageUrl()} />;
  }

  return null;
};
