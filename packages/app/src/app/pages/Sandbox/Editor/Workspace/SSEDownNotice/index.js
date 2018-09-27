import React from 'react';
import { observer, inject } from 'mobx-react';

import { Container } from './elements';

class ConnectionNotice extends React.PureComponent {
  render() {
    return (
      <Container>
        <p style={{ fontWeight: 700, marginTop: 0 }}>
          Server Manager Disconnected
        </p>
        It seems like our manager for container sandboxes is experiencing some
        heavy load. We will try to reconnect in a couple seconds...
        <p style={{ marginBottom: 0 }}>
          It would greatly help us if you could let us know on{' '}
          <a
            style={{ color: 'white' }}
            href="https://discord.gg/FGeubVt"
            target="_blank"
          >
            Discord
          </a>.
        </p>
      </Container>
    );
  }
}

export default observer(ConnectionNotice);
