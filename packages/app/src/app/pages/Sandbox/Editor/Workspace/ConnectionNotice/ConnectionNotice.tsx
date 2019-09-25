import React from 'react';
import { useOvermind } from 'app/overmind';
import { Container } from './elements';

export const ConnectionNotice = () => {
  const {
    state: { connected },
  } = useOvermind();

  return (
    !connected && (
      <Container>
        You{"'"}re not connected to the internet. You can still edit, but you
        cannot save. We recommend using the {"'"}Download{"'"} function to keep
        your changes.
      </Container>
    )
  );
};
