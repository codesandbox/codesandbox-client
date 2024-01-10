import filesize from 'filesize';
import React, { FunctionComponent } from 'react';
import { useAppState } from 'app/overmind';
import { Text } from '@codesandbox/components';

import { LoadingAnimationContainer } from './elements';
import { FilesList } from './FilesList';
import { Alert } from '../Common/Alert';

export const StorageManagementModal: FunctionComponent = () => {
  const { maxStorage, uploadedFiles, usedStorage } = useAppState();
  const isLoading = uploadedFiles === null;
  const isEmpty = !isLoading && uploadedFiles.length === 0;

  return (
    <Alert
      title="Storage Management"
      description="This is where you can manage your uploaded files."
    >
      <Text variant="muted" align="center" size={3}>
        {`Used ${filesize(usedStorage)} / Total ${filesize(maxStorage)}`}
      </Text>
      {!isEmpty && !isLoading && <FilesList />}
      {isEmpty && (
        <Text align="center" weight="bold" block marginTop={6} marginBottom={6}>
          You have no uploaded files.
        </Text>
      )}
      {isLoading && <LoadingAnimationContainer />}
    </Alert>
  );
};
