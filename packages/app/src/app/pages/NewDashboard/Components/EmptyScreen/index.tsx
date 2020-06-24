import React from 'react';
import { useLocation } from 'react-router-dom';
import { Stack, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { NewSandbox } from '../Sandbox/NewSandbox';

export const EmptyScreen = () => {
  const { actions } = useOvermind();

  const location = useLocation();
  const isSearch = location.pathname.includes('/search');

  const onClick = () => actions.modalOpened({ modal: 'newSandbox' });

  if (isSearch) {
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
      <Stack direction="vertical" align="center" gap={8} css={{ width: 400 }}>
        <Stack align="center" css={{ width: 220 }}>
          <NewSandbox />
        </Stack>

        <Stack direction="vertical" align="center">
          <Text variant="muted">You haven’t created any sandboxes yet.</Text>
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
              Template
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
