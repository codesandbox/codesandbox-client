import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Cerebral } from 'app/store';
import { Container } from './elements';

export const ConnectionNotice = observer(() => {
  const { store } = useContext(Cerebral);

  return (
    !store.connected && (
      <Container>
        You{"'"}re not connected to the internet. You can still edit, but you
        cannot save. We recommend using the {"'"}Download{"'"} function to keep
        your changes.
      </Container>
    )
  );
});
