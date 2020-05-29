import { Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { MdCheck } from 'react-icons/md';

export const ButtonActions = () => {
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { actions, effects } = useOvermind();
  const timeout = React.useRef(null);
  const copyLink = () => {
    setLinkCopied(true);

    effects.browser.copyToClipboard(document.location.href);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Stack justify="flex-end" direction="horizontal" gap={2}>
      <Button
        css={css({ width: 'initial' })}
        variant="secondary"
        onClick={() => {
          actions.modalOpened({ modal: 'share' });
        }}
      >
        Embed
      </Button>
      <Button css={css({ width: 128 })} variant="secondary" onClick={copyLink}>
        {linkCopied ? (
          <motion.div
            key="copied"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -60, opacity: 0.7 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              css={css({ marginRight: 1 })}
            >
              <MdCheck />
            </motion.div>{' '}
            Copied!
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={mounted ? { scale: 0.8, opacity: 0.7 } : false}
            animate={{ scale: 1, opacity: 1 }}
          >
            Copy Sandbox Link
          </motion.div>
        )}
      </Button>
    </Stack>
  );
};
