import { Stack, Text, Icon } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import React from 'react';

export const RestrictedPrivateReposInfo: React.FC = () => {
  const { modalOpened } = useActions();

  return (
    <Stack gap={1} css={{ color: '#A8BFFA', alignItems: 'center' }}>
      <Icon name="circleBang" />
      <Text size={3}>Looking for a private repository?</Text>
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
        Update your GitHub permissions.
      </Text>
    </Stack>
  );
};
