import React from 'react';

import { Container } from './elements';

const pad = t => {
  if (`${t}`.length === 1) {
    return `0${t}`;
  }

  return `${t}`;
};

class ConnectionNotice extends React.PureComponent {
  render() {
    if (!this.state.downtimeTime) {
      return null;
    }

    if (Date.now() > this.state.downtimeTime) {
      return (
        <Container>
          <p style={{ fontWeight: 700, marginTop: 0 }}>
            Server Manager Disconnected
          </p>
          It seems like our manager for container sandboxes is experiencing some
          heavy load. We will try to reconnect to the manager in a couple
          minutes.
        </Container>
      );
    }

    // 10 minutes
    if (this.state.downtimeTime - Date.now() > 1000 * 60 * 10) {
      return null;
    }

    return (
      <Container>
        <p style={{ fontWeight: 700, marginTop: 0 }}>MAINTENANCE NOTICE</p>
        We will migrate our servers to Google Cloud Platform in{' '}
        <span style={{ fontWeight: 700 }}>{this.renderCountdown()}</span>
        {this.state.niceTime ? ` ${this.state.niceTime}` : ''}.
        <p style={{ marginBottom: 0 }}>
          The editor will still work as usual, but we have disabled saving and
          forking during the migration. Make sure to save your work beforehand.
        </p>
      </Container>
    );
  }
}

export default ConnectionNotice;
