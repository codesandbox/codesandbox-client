import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Container = styled.div`
  color: ${props => props.theme.red};
  background-color: ${props => props.theme.redBackground};
  padding: 1rem;
  font-size: 0.75rem;
`;

const mapStateToProps = state => ({
  connected: state.connectionStatus.connected,
});
const ConnectionNotice = ({ connected }: { connected: boolean }) =>
  !connected && (
    <Container>
      You{"'"}re not connected to the internet. You can still edit, but you
      cannot save. We recommend using the {"'"}Download{"'"} function to keep
      your changes.
    </Container>
  );

export default connect(mapStateToProps)(ConnectionNotice);
