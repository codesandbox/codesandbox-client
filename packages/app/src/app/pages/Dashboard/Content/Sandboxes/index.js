import React from 'react';

import SandboxGrid from '../SandboxGrid';

import { Container, HeaderContainer } from './elements';

class Content extends React.Component {
  render() {
    const { sandboxes, Header } = this.props;

    return (
      <Container>
        <HeaderContainer>{Header}</HeaderContainer>
        <SandboxGrid sandboxes={sandboxes} />
      </Container>
    );
  }
}

export default Content;
