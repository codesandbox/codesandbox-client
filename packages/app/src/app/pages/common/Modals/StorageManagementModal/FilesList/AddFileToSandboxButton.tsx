import { UploadFile } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';
import { Button, Icon } from '@codesandbox/components';

type Props = Pick<UploadFile, 'name' | 'url'>;
export const AddFileToSandboxButton: FunctionComponent<Props> = ({
  name,
  url,
}) => {
  const { addedFileToSandbox } = useActions().files;
  const { currentSandbox } = useAppState().editor;

  if (!currentSandbox) {
    return null;
  }

  return (
    <Button
      autoWidth
      variant="secondary"
      disabled={!currentSandbox}
      title="Add file to sandbox"
      onClick={() => addedFileToSandbox({ name, url })}
    >
      <Icon name="plus" />
    </Button>
  );
};
