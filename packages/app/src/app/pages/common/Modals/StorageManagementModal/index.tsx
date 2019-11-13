import filesize from 'filesize';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import {
  Container,
  Title,
  JustifiedArea,
  SubTitle,
  Description,
  SubDescription,
  Rule,
  LoadingAnimationContainer,
} from './elements';
import FilesList from './FilesList';

export const StorageManagementModal: FunctionComponent = () => {
  const {
    state: { usedStorage, maxStorage, uploadedFiles },
    actions: {
      files: { deletedUploadedFile, addedFileToSandbox },
    },
  } = useOvermind();

  const isLoading = uploadedFiles === null;
  const isEmpty = !isLoading && uploadedFiles.length === 0;

  return (
    <Container>
      <JustifiedArea>
        <Title>Storage Management</Title>

        <SubTitle>
          Used {filesize(usedStorage)}
          {' / '}
          Total {filesize(maxStorage)}
        </SubTitle>
      </JustifiedArea>

      <Description>
        This is where you can manage your uploaded files.
      </Description>

      <Rule />

      {!isEmpty && !isLoading && (
        <FilesList
          files={uploadedFiles}
          deleteFile={deletedUploadedFile}
          deleteFiles={files => files.map(id => deletedUploadedFile({ id }))}
          addFilesToSandbox={files => files.map(addedFileToSandbox)}
          addFileToSandbox={addedFileToSandbox}
        />
      )}

      {isEmpty && <SubDescription>You have no uploaded files.</SubDescription>}

      {isLoading && <LoadingAnimationContainer />}
    </Container>
  );
};
