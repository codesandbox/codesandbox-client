import React, { useEffect, useState } from 'react';
import css from '@styled-system/css';
import { Stack, Text, Button } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { motion, AnimatePresence } from 'framer-motion';

export const SignInBanner = () => {
  const { signInClicked } = useActions();
  const state = useAppState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (state.editor.changeCounter >= 3) {
      setShow(true);
    }
  }, [state.editor.changeCounter]);

  return (
    <AnimatePresence>
      {show && (
        <Stack
          as={motion.div}
          animate={{ y: 0 }}
          initial={{ y: -70 }}
          exit={{ y: -70 }}
          transition={{ ease: 'easeOut' }}
          padding={4}
          justify="center"
          align="center"
          css={css({
            position: 'absolute',
            width: '100vw',
            height: 49,
            zIndex: 9999,
            backgroundColor: 'statusBar.background',
          })}
        >
          <Button
            autoWidth
            css={css({
              color: '#F7A239',
              height: 'auto',
              padding: 0,
              fontSize: 3,
              paddingRight: '.3em',
              ':hover:not(:disabled), :focus:not(:disabled)': {
                color: '#F7A239',
              },
            })}
            onClick={() => {
              track('Header Sign In Ad Clicked');
              signInClicked();
            }}
            variant="link"
          >
            Sign up for free
          </Button>
          <Text css={css({ lineHeight: 1 })}>
            to save your work{' '}
            <span role="img" aria-label="sparkles">
              ✨
            </span>
          </Text>

          <Button
            css={css({
              width: 6,
              padding: 0,
              display: 'block',
              color: 'sideBar.foreground',
              position: 'absolute',
              right: '1em',
              top: '1em',
            })}
            variant="link"
            padding={0}
            onClick={() => setShow(false)}
          >
            <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M17.508 7.301l-1.083-1.09-4.872 4.909-4.871-4.91-1.083 1.091 4.872 4.91-4.872 4.909 1.083 1.09 4.871-4.909 4.872 4.91 1.082-1.091-4.871-4.91 4.872-4.909z"
              />
            </svg>
          </Button>
        </Stack>
      )}
    </AnimatePresence>
  );
};
