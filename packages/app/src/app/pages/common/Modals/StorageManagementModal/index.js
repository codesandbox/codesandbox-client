import React from 'react';
import {
  Container,
  Title,
  JustifiedArea,
  SubTitle,
  Description,
  Rule,
} from './elements';
import FilesList from './FilesList';

function StorageManagementModal() {
  return (
    <Container>
      <JustifiedArea>
        <Title>Storage Management</Title>
        <SubTitle>Used 10GB{' / '}Total 20GB</SubTitle>
      </JustifiedArea>
      <Description>
        This is where you can manage your uploaded files.
      </Description>
      <Rule />
      <FilesList />
    </Container>
  );
}

export default StorageManagementModal;
