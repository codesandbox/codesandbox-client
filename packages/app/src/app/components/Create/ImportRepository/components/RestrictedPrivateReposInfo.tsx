import { Stack, Text, Icon } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import React from 'react';

export const RestrictedPrivateReposInfo: React.FC = () => {
  const { modalOpened } = useActions();

  return (
    <Stack gap={1} direction="vertical" css={{ color: '#A8BFFA' }}>
      <Text size={3}>Looking for a private repo?</Text>
      <Text
        size={3}
        as="button"
        css={{
          fontSize: '13px',
          lineHeight: '16px',
          fontFamily: 'inherit',
          padding: 0,
          border: 'none',
          background: 'inherit',
          color: 'inherit',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        onClick={() =>
          modalOpened({ modal: 'preferences', itemId: 'integrations' })
        }
      >
        Update GitHub permissions
      </Text>
    </Stack>
  );
};
