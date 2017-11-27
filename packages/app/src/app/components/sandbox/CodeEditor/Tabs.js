import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 2.5rem;
  flex: 0 0 2.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

export default class EditorTabs extends React.PureComponent {
  render() {
    return <Container>Heyo</Container>;
  }
}
