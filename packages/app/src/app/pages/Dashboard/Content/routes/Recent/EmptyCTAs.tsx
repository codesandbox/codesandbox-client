import { Button, Stack, Text } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';

export const EmptyCTAs: React.FC<{ isFrozen: boolean }> = ({ isFrozen }) => {
  const actions = useActions();

  return (
    <Stack direction="vertical" align="center" gap={4} padding={8}>
      <Text size={6}>You have no recent work</Text>
      <Stack gap={2}>
        <Button
          onClick={() => {
            track('Empty Recent - Explore templates');
            actions.modalOpened({ modal: 'createDevbox' });
          }}
          disabled={isFrozen}
          variant="secondary"
          autoWidth
        >
          Explore templates
        </Button>
        <Button
          onClick={() => {
            track('Empty Recent - Import repository');
            actions.modalOpened({ modal: 'importRepository' });
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
