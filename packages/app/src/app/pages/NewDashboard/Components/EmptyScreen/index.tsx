import React from 'react';
import { Stack, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
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
  const { actions } = useOvermind();

  const onClick = () => actions.openCreateSandboxModal({ collectionId });

  if (page === 'search') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no sandboxes that match your query
        </Text>
      </Stack>
    );
  }

  if (page === 'deleted') {
    return (
      <Stack justify="center" align="center" marginTop={120}>
        <Text variant="muted">
          There are no deleted sandboxes yet! Drag sandboxes or templates to
          this page to delete them.
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
            Uh oh, you haven’t created any sandboxes in this folder yet!
          </Text>
          <Stack align="center" gap={1}>
            <Text variant="muted">Start with a</Text>
            <Button
              variant="link"
              onClick={onClick}
              css={css({
                color: 'blues.600',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                width: 'fit-content',
                padding: 0,
              })}
            >
              template
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
