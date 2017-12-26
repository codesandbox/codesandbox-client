import React from 'react';
import { inject, observer } from 'mobx-react';

import { Container } from './elements';

function ConnectionNotice({ store }) {
  return (
    !store.connected && (
      <Container>
        You{"'"}re not connected to the internet. You can still edit, but you
        cannot save. We recommend using the {"'"}Download{"'"} function to keep
        your changes.
      </Container>
    )
  );
}

export default inject('store')(observer(ConnectionNotice));
