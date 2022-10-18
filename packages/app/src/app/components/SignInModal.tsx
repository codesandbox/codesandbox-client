import React, { useEffect, useCallback } from 'react';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { ThemeProvider, Stack } from '@codesandbox/components';
import OutsideClickHandler from 'react-outside-click-handler';
import { SignInModalElement } from 'app/pages/SignIn/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState, useActions } from 'app/overmind';
import { useControls } from 'leva';

export const SignInModal = () => {
  const { toggleSignInModal } = useActions();
  const { redirectOnLogin, signInModalOpen, user } = useAppState();
  const [{ showSignInModal }, set] = useControls(() => ({
    showSignInModal: false,
  }));

  const closeModal = useCallback(
    event => {
      if (event.keyCode === ESC && signInModalOpen) {
        toggleSignInModal();
      }

      if (event.keyCode === ESC && showSignInModal) {
        set({ showSignInModal: false });
      }
    },
    [toggleSignInModal, signInModalOpen, showSignInModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', closeModal, false);
    return () => document.removeEventListener('keydown', closeModal, false);
  }, [closeModal]);

  if (!showSignInModal && (!signInModalOpen || user)) {
    return null;
  }

  return (
    <ThemeProvider>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, zIndex: 9999 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
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
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
};
