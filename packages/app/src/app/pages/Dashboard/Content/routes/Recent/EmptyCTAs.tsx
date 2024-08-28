import { Button, Stack, Text } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import React from 'react';

export const EmptyCTAs: React.FC<{ isFrozen: boolean }> = ({ isFrozen }) => {
  const actions = useActions();

  return (
    <Stack direction="vertical" align="center" gap={4} padding={8}>
      <Text size={6}>You have no recent work</Text>
      <Stack gap={2}>
        <Button
          onClick={() => {
            actions.modalOpened({ modal: 'create' });
          }}
          disabled={isFrozen}
          variant="secondary"
          autoWidth
        >
          Explore templates
        </Button>
        <Button
          onClick={() => {
            actions.modalOpened({ modal: 'import' });
          }}
          disabled={isFrozen}
          variant="secondary"
          autoWidth
        >
          Import repository
        </Button>
      </Stack>
    </Stack>
  );
};
