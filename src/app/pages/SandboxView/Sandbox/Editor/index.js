/* @flow */
import React from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';

import Workspace from './Workspace';

import type { Sandbox } from '../../../../store/entities/sandboxes/entity';
// import Content from './Content';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  width: 100%;
  height: 100%;
`;

type Props = {
  sandbox: Sandbox,
};

export default class Editor extends React.PureComponent {
  props: Props;

  render() {
    const { sandbox } = this.props;

    return (
      <SplitPane split="vertical" minSize={100} defaultSize={16 * 16}>
        <Workspace sandbox={sandbox} />
        <Frame>Content</Frame>
        {/* <Content sandbox={sandbox} params={this.props.params} /> */}
      </SplitPane>
    );
  }
}
