import React from 'react';
import FolderIcon from 'react-icons/lib/md/folder';

import theme from 'common/theme';

import { Container, IconContainer } from './elements';

export default class FolderEntry extends React.Component {
  render() {
    const { name, path } = this.props;

    const url = `/dashboard/sandboxes${path}`;

    return (
      <Container
        activeStyle={{
          borderColor: theme.secondary(),
          color: 'white',
        }}
        exact
        to={url}
      >
        <IconContainer>
          <FolderIcon />
        </IconContainer>{' '}
        {name}
      </Container>
    );
  }
}
