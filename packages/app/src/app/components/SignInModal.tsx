import React, { useEffect, useCallback } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { motion, AnimatePresence } from 'framer-motion';
import { css } from '@styled-system/css';

import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { ThemeProvider, Stack, Element } from '@codesandbox/components';
import { SignIn } from 'app/pages/SignIn/SignIn';
import { useAppState, useActions } from 'app/overmind';

export const SignInModal = () => {
  const { toggleSignInModal } = useActions();
  const { signInModalOpen, user } = useAppState();

  const closeModal = useCallback(
    event => {
      if (event.keyCode === ESC && signInModalOpen) {
        toggleSignInModal();
      }
    },
    [toggleSignInModal, signInModalOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', closeModal, false);
    return () => document.removeEventListener('keydown', closeModal, false);
  }, [closeModal]);

  if (!signInModalOpen || user) {
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

              // OutsideClickHandler styles
              // can't use styled(OutsideClickHandler)
              '> div': {
                flexGrow: 1,
                maxWidth: '720px',
              },
            }}
          >
            <OutsideClickHandler onOutsideClick={toggleSignInModal}>
              <Element
                css={css({
                  boxSizing: 'border-box',
                  backgroundColor: '#1D1D1D',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  margin: 'auto',
                  padding: '24px',
                  width: '100%',
                  display: 'flex',

                  // With tokens
                  boxShadow: '2',
                })}
              >
                <SignIn />
              </Element>
            </OutsideClickHandler>
          </Stack>
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
};
