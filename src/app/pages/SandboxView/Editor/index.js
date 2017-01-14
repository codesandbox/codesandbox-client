/* @flow */
import React from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';

import Workspace from './Workspace';

import type { Sandbox } from '../../../store/entities/sandboxes';
import Menu from './Menu';
import Content from './Content';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: auto;
`;

type Props = {
  sandbox: Sandbox;
  params: {
    module: string;
  };
};

export default class Editor extends React.PureComponent {
  props: Props;

  render() {
    const { sandbox } = this.props;

    return (
      <Container>
        <Menu sandbox={sandbox} />
        <div style={{ position: 'relative', flex: 'auto' }}>
          <SplitPane split="vertical" minSize={100} defaultSize={16 * 16}>
            <Workspace sandbox={sandbox} />
            <Content sandbox={sandbox} params={this.props.params} />
          </SplitPane>
        </div>
      </Container>
    );
  }
}

