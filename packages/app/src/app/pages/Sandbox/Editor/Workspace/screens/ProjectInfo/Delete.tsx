import React, { MouseEvent } from 'react';
import { useOvermind } from 'app/overmind';
import { css } from '@styled-system/css';
import { Button, Stack } from '@codesandbox/components';

export const Delete = () => {
  const {
    actions: {
      modalOpened,
      workspace: { deleteTemplate },
    },
    state: {
      editor: {
        currentSandbox: { customTemplate },
      },
    },
  } = useOvermind();

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (customTemplate) {
      deleteTemplate();
    } else {
      modalOpened({ modal: 'deleteSandbox' });
    }
  };

  return (
    <Stack justify="center" marginBottom={3}>
      <Button
        // @ts-ignore
        onClick={onDelete}
        variant="link"
        css={css({
          ':hover,:focus': { color: 'errorForeground' },
        })}
      >
        {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
      </Button>
    </Stack>
  );
};
