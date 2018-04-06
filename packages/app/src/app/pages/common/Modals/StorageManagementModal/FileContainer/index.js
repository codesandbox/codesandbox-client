import React from 'react';

import { SubContainer } from '../elements';

import FileItem from './FileItem';

export default class FileContainer extends React.Component {
  render() {
    return (
      <SubContainer>
        <FileItem name="testing filename" date="12/12/1222" />
      </SubContainer>
    );
  }
}
