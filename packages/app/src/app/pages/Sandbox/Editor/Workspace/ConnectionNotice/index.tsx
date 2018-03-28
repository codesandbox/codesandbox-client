import * as React from 'react';
import { connect } from 'app/fluent';

import { Container } from './elements';

export default connect()
  .with(({ state }) => ({
    connected: state.connected
  }))
  .to(
    function ConnectionNotice({ connected }) {
      return (
        !connected && (
          <Container>
            You{"'"}re not connected to the internet. You can still edit, but you
            cannot save. We recommend using the {"'"}Download{"'"} function to keep
            your changes.
          </Container>
        )
      );
    }
  )
