import React from 'react';
import filesize from 'filesize';
import { inject, observer } from 'mobx-react';
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

// eslint-disable-next-line
class StorageManagementModal extends React.Component {
  render() {
    const { store, signals } = this.props;

    const isLoading = store.uploadedFiles === null;
    const isEmpty = !isLoading && store.uploadedFiles.length === 0;

    return (
      <Container>
        <JustifiedArea>
          <Title>Storage Management</Title>
          <SubTitle>
            Used {filesize(store.usedStorage)}
            {' / '}Total {filesize(store.maxStorage)}
          </SubTitle>
        </JustifiedArea>
        <Description>
          This is where you can manage your uploaded files.
        </Description>
        <Rule />
        {!isEmpty &&
          !isLoading && (
            <FilesList
              files={store.uploadedFiles}
              deleteFile={signals.files.deletedUploadedFile}
              addFileToSandbox={signals.files.addedFileToSandbox}
            />
          )}
        {isEmpty && (
          <SubDescription>You have no uploaded files.</SubDescription>
        )}
        {isLoading && <LoadingAnimationContainer />}
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(StorageManagementModal));
