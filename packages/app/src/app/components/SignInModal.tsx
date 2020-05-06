import React, { useEffect, useCallback } from 'react';
import { ThemeProvider, Stack } from '@codesandbox/components';
import codeSandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import OutsideClickHandler from 'react-outside-click-handler';
import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { useOvermind } from 'app/overmind';

export const SignInModal = () => {
  const {
    actions: { toggleSignInModal },
    state: { redirectOnLogin },
  } = useOvermind();

  const closeModal = useCallback(
    event => {
      if (event.keyCode === 27 && open) toggleSignInModal();
    },
    [toggleSignInModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', closeModal, false);
    return () => document.removeEventListener('keydown', closeModal, false);
  }, [closeModal]);

  return (
    <ThemeProvider theme={codeSandboxBlack}>
      <Stack
        align="center"
        justify="center"
        css={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.75)',
        }}
      >
        <OutsideClickHandler onOutsideClick={toggleSignInModal}>
          <SignInModalElement redirectTo={redirectOnLogin} />
        </OutsideClickHandler>
      </Stack>
    </ThemeProvider>
  );
};
