import { UploadFile } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';

import { useActions } from 'app/overmind';
import { Button, Icon } from '@codesandbox/components';

type Props = Pick<UploadFile, 'id'>;
export const DeleteFileButton: FunctionComponent<Props> = ({ id }) => {
  const { deleteUploadedFile } = useActions();

  return (
    <Button
      css={css({
        width: 'auto',
        '&:hover': {
          background: theme =>
            theme.colors.dangerButton.background + ' !important',
          color: 'dangerButton.foreground',
        },
      })}
      variant="secondary"
      onClick={() => deleteUploadedFile(id)}
      title="Delete File"
    >
      <Icon name="trash" />
    </Button>
  );
};
