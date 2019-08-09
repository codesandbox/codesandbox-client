import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import { Container } from './elements';

export const ConnectionNotice = inject('store')(
  hooksObserver(
    ({ store: { connected } }) =>
      !connected && (
        <Container>
          You{"'"}re not connected to the internet. You can still edit, but you
          cannot save. We recommend using the {"'"}Download{"'"} function to
          keep your changes.
        </Container>
      )
  )
);
