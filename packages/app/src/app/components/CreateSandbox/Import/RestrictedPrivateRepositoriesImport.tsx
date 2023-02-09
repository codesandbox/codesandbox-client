import { Element, Stack, Text, Button, Icon } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import React from 'react';

export const RestrictedPrivateReposImport: React.FC = () => {
  const { modalOpened } = useActions();

  return (
    <Stack
      align="center"
      css={{
        fontSize: '13px',
        lineHeight: '18px',
      }}
    >
      <Text>
        Repository not found. You may be missing permissions needed to access
        it.
      </Text>
      <Button
        css={{
          color: '#FFFFFF',
          cursor: 'pointer',
          gap: '4px',
        }}
        onClick={() =>
          modalOpened({ modal: 'preferences', itemId: 'integrations' })
        }
        variant="link"
        autoWidth
      >
        Review your GitHub permissions
        <Element css={{ marginTop: '2px' }}>
          <Icon name="external" size={12} />
        </Element>
      </Button>
    </Stack>
  );
};
