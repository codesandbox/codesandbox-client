import React, { useEffect } from 'react';
import css from '@styled-system/css';
import { motion } from 'framer-motion';
import { Stack, Button } from '@codesandbox/components';
import CheckIcon from 'react-icons/lib/md/check';
import { useOvermind } from 'app/overmind';

const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const ButtonActions = () => {
  const [linkCopied, setLinkCopied] = React.useState(false);
  const { actions } = useOvermind();
  const timeout = React.useRef(null);
  const copyLink = () => {
    setLinkCopied(true);

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
              <CheckIcon />
            </motion.div>{' '}
            Copied!
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            Copy Sandbox Link
          </motion.div>
        )}
      </Button>
    </Stack>
  );
};
