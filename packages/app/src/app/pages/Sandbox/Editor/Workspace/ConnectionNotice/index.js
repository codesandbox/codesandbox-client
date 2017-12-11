import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

const Container = styled.div`
  color: ${props => props.theme.red};
  background-color: ${props => props.theme.redBackground};
  padding: 1rem;
  font-size: 0.75rem;
`;

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
