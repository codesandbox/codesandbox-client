import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore } from 'app/store';

import { Container } from './elements';

export const ConnectionNotice = observer(() => {
  const { connected } = useStore();

  return (
    !connected && (
      <Container>
        You{"'"}re not connected to the internet. You can still edit, but you
        cannot save. We recommend using the {"'"}Download{"'"} function to keep
        your changes.
      </Container>
    )
  );
});
