import { Stack, Text } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';

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
        onClick={() => {
          modalOpened({ modal: 'preferences', itemId: 'integrations' });
          track('Import repo - Restricted private repos info clicked');
        }}
      >
        Update GitHub permissions
      </Text>
    </Stack>
  );
};
