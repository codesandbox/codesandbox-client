import { UploadFile } from '@codesandbox/common/es/types';
import { Button, Icon } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

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
      <Icon name="plus" />
    </Button>
  );
};
