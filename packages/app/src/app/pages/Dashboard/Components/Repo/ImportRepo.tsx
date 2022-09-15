import React from 'react';
import { useActions } from 'app/overmind';
import { Stack, Text, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';

export const ImportRepo = () => {
  const { openCreateSandboxModal } = useActions();

  const onClick = () => openCreateSandboxModal({});

  return (
    <Button
      variant="link"
      onClick={onClick}
      css={css({
        height: 240,
        fontSize: 3,
        backgroundColor: 'grays.700',
        borderRadius: 'medium',
        transition: 'background ease-in',
        transitionDuration: theme => theme.speeds[2],
        ':hover, :focus, :focus-within': {
          backgroundColor: 'card.backgroundHover',
        },
      })}
    >
      <Stack direction="vertical" align="center" gap={4}>
        <Icon name="plus" size={32} />
        <Text>Import Repository</Text>
      </Stack>
    </Button>
  );
};
