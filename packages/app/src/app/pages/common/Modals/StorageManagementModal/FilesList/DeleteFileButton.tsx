import { UploadFile } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import DeleteIcon from 'react-icons/lib/md/delete';

import { useOvermind } from 'app/overmind';

import { Button } from './Button';

type Props = Pick<UploadFile, 'id'>;
export const DeleteFileButton: FunctionComponent<Props> = ({ id }) => {
  const {
    actions: {
      files: { deletedUploadedFile },
    },
  } = useOvermind();

  return (
    <Button
      Icon={DeleteIcon}
      onClick={() => deletedUploadedFile(id)}
      tooltip="Delete File"
    />
  );
};
