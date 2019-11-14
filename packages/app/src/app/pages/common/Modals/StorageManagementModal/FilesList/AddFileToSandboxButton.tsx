import { UploadFile } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';
import AddIcon from 'react-icons/lib/md/add';

import { useOvermind } from 'app/overmind';

import { Button } from './Button';

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

  return (
    <Button
      disabled={!currentSandbox}
      Icon={AddIcon}
      onClick={() => addedFileToSandbox({ name, url })}
      tooltip="Add file to sandbox"
    />
  );
};
