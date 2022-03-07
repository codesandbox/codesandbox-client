import { Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { FunctionComponent, MouseEvent } from 'react';

import { useAppState, useActions } from 'app/overmind';

export const Delete: FunctionComponent = () => {
  const {
    modalOpened,
    workspace: { deleteTemplate },
  } = useActions();
  const {
    currentSandbox: { customTemplate },
  } = useAppState().editor;

  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (customTemplate) {
      deleteTemplate();
    } else {
      modalOpened({ modal: 'deleteSandbox' });
    }
  };

  return (
    <Stack justify="center" marginBottom={6}>
      <Button
        css={css({
          ':hover:not(:disabled),:focus:not(:disabled)': {
            color: 'errorForeground',
          },
        })}
        // @ts-ignore
        onClick={onDelete}
        variant="link"
      >
        {`Delete ${customTemplate ? `Template` : `Sandbox`}`}
      </Button>
    </Stack>
  );
};
