import React, { useEffect } from 'react';
import css from '@styled-system/css';
import { motion } from 'framer-motion';
import { Stack, Select, Button, Text } from '@codesandbox/components';
import CheckIcon from 'react-icons/lib/md/check';
import { useOvermind } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';

export const ChangeLinkPermissionForm = () => {
  const { actions, state } = useOvermind();

  const [linkCopied, setLinkCopied] = React.useState(false);
  const timeout = React.useRef(null);
  const copyLink = () => {
    setLinkCopied(true);

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

  const changePrivacy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    actions.workspace.sandboxPrivacyChanged({
      privacy: Number(value) as 0 | 1 | 2,
      source: 'sharesheet',
    });
  };

  const canEdit = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );

  return (
    <Stack align="center" direction="vertical" gap={2}>
      <Stack gap={2}>
        <Select disabled={!state.isPatron || !canEdit} onChange={changePrivacy}>
          <option>Public for everyone (Public)</option>
          <option>Only people with link can view (Unlisted)</option>
          <option>Only visible to invited collaborators (Private)</option>
        </Select>

        <Button
          css={css({ display: 'inline', width: 130 })}
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
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              Copy Sandbox Link
            </motion.div>
          )}
        </Button>
      </Stack>

      {!state.isPatron && (
        <Text size={2} variant="muted">
          You can change the visibility of a sandbox with{' '}
          <a href="/pro" target="_blank" rel="noreferrer noopener">
            CodeSandbox Pro
          </a>
        </Text>
      )}
    </Stack>
  );
};
