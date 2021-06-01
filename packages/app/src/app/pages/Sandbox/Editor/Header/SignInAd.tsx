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
      {show ? (
        <motion.div
          animate={{ y: 0 }}
          initial={{ y: -70 }}
          exit={{ y: -70 }}
          transition={{ ease: 'easeOut' }}
        >
          <Stack
            padding={4}
            css={css({
              position: 'absolute',
              backgroundColor: 'button.background',
              width: '100vw',
              height: 49,
              alignItems: 'center',
              color: 'sideBar.foreground',
              zIndex: 9999,
            })}
          >
            <Stack
              align="center"
              justify="space-between"
              css={css({ width: '100%' })}
            >
              <Stack
                gap={4}
                align="center"
                css={css({ margin: 'auto !important' })}
              >
                <Stack
                  paddingY={1}
                  paddingX={2}
                  css={css({
                    backgroundColor: 'sideBar.foreground',
                    color: 'button.background',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '1',
                    borderRadius: 'small',
                  })}
                >
                  Tip
                </Stack>
                <Text>
                  Register to save your work, code on any device, deploy, and
                  collaborate
                </Text>
              </Stack>
              <Stack gap={4}>
                <Button
                  autoWidth
                  css={css({
                    color: 'sideBar.foreground',
                    ':hover:not(:disabled), :focus:not(:disabled)': {
                      color: 'sideBar.foreground',
                    },
                  })}
                  onClick={() => {
                    track('Header Sign In Ad Clicked');
                    signInClicked();
                  }}
                  variant="link"
                >
                  Sign in to Save
                </Button>
                <Button
                  css={css({
                    width: 6,
                    padding: 0,
                    display: 'block',
                    color: 'sideBar.foreground',
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
            </Stack>
          </Stack>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
