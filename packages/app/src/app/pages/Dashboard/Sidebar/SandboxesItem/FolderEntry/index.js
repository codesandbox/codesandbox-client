import React from 'react';
import FolderIcon from 'react-icons/lib/md/folder';

import { Container, IconContainer } from './elements';

export default class FolderEntry extends React.PureComponent {
  render() {
    const { name } = this.props;

    return (
      <Container>
        <IconContainer>
          <FolderIcon />
        </IconContainer>{' '}
        {name}
      </Container>
    );
  }
}
