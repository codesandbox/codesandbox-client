import React, { useEffect } from 'react';
import css from '@styled-system/css';
import { motion } from 'framer-motion';
import { Stack, Button } from '@codesandbox/components';
import CheckIcon from 'react-icons/lib/md/check';
import { useEffects, useActions } from 'app/overmind';

export const ButtonActions = () => {
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { modalOpened, track } = useActions();
  const { copyToClipboard } = useEffects().browser;
  const timeout = React.useRef(null);
  const copyLink = () => {
    setLinkCopied(true);
    track({ name: "Share - 'Copy Sandbox URL' Clicked", data: {} });

    copyToClipboard(document.location.href);

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
          modalOpened({ modal: 'share' });
        }}
      >
        Embed
      </Button>
      <Button
        css={css({ width: 'initial' })}
        variant="secondary"
        onClick={copyLink}
      >
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
              <CheckIcon />
            </motion.div>{' '}
            Copied!
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={mounted ? { scale: 0.8, opacity: 0.7 } : false}
            animate={{ scale: 1, opacity: 1 }}
          >
            Copy link
          </motion.div>
        )}
      </Button>
    </Stack>
  );
};
