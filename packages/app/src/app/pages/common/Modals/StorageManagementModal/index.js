import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Container,
  Title,
  JustifiedArea,
  SubTitle,
  Description,
  Rule,
} from './elements';
import FileContainer from './FileContainer';

class StorageManagementModal extends React.Component {
  render() {
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
        <FileContainer />
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(StorageManagementModal));
