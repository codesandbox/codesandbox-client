import { UploadFile } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import AddIcon from 'react-icons/lib/md/add';

import { useOvermind } from 'app/overmind';
import { Button } from '@codesandbox/components';

type Props = Pick<UploadFile, 'name' | 'url'>;
export const AddFileToSandboxButton: FunctionComponent<Props> = ({
  name,
  url,
}) => {
  const {
    actions: {
      files: { addedFileToSandbox },
    },
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  if (!currentSandbox) {
    return null;
  }

  return (
    <Button
      css={{ width: 'auto' }}
      variant="secondary"
      disabled={!currentSandbox}
      title="Add file to sandbox"
      onClick={() => addedFileToSandbox({ name, url })}
    >
      <AddIcon />
    </Button>
  );
};
