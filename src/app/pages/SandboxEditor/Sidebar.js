// @flow
import React from 'react';
import styled from 'styled-components';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import ModulesContainer from './ModulesContainer';
import DeleteTarget from './DeleteTarget';

import type { Sandbox } from '../../store/entities/sandboxes/';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  overflow: auto;
  min-width: 16rem;
`;

const Title = styled.h2`
  padding: 1rem;
  margin: 0 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 300;

  border-bottom: 1px solid ${props => props.theme.background.lighten(0.5)};
`;

type Props = {
  sandbox: ?Sandbox;
  deleteModule: (id: string) => void;
}
class Sidebar extends React.PureComponent { // eslint-disable-line
  props: Props;
  render() {
    const { sandbox, deleteModule } = this.props;

    return (
      <Container>
        <Title>{sandbox ? sandbox.title : 'Loading...'}</Title>
        {sandbox && <ModulesContainer sandbox={sandbox} />}
        <DeleteTarget deleteModule={deleteModule} />
      </Container>
    );
  }
}

export default DragDropContext(HTML5Backend)(Sidebar);
