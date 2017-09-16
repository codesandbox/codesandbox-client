import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

export default class Deploy extends React.PureComponent {
  render() {
    return <Container>Deploy</Container>;
  }
}
