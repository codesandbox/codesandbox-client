import React from 'react';
import DelayedAnimation from 'app/components/DelayedAnimation';

import SandboxGrid from '../SandboxGrid';

import { Container, HeaderContainer } from './elements';

class Content extends React.Component {
  render() {
    const { sandboxes, Header, isLoading } = this.props;

    return (
      <Container>
        <HeaderContainer>{Header}</HeaderContainer>
        {isLoading ? (
          <DelayedAnimation
            delay={600}
            style={{
              marginTop: '2rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Fetching Sandboxes...
          </DelayedAnimation>
        ) : (
          <SandboxGrid sandboxes={sandboxes} />
        )}
      </Container>
    );
  }
}

export default Content;
