import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { NewSandbox } from '../Sandbox/NewSandbox';
import { PageTypes } from '../../types';

interface EmptyScreenProps {
  collectionId?: string;
  page: PageTypes;
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({
  collectionId,
  page,
}) => {
  if (page === 'search') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no sandboxes that match your query
        </Text>
      </Stack>
    );
  }

  return (
    <Stack justify="center" align="center" marginTop={120}>
      <Stack
        direction="vertical"
        align="center"
        gap={8}
        css={{ width: 500, height: '100vh', userSelect: 'none' }}
      >
        <Stack align="center" css={{ width: 220 }}>
          <NewSandbox collectionId={collectionId} />
        </Stack>

        <Stack direction="vertical" align="center" gap={1}>
          <Text variant="muted" align="center">
            Uh oh, you haven&apos;t created any sandboxes in this folder yet!
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
