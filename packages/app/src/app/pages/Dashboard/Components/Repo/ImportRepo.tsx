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
        backgroundColor: 'card.background',
        border: '1px solid transparent',
        borderRadius: 'medium',
        transition: 'all ease-in',
        transitionDuration: theme => theme.speeds[2],
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
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
