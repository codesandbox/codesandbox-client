/* @flow */
import React from 'react';
import SplitPane from 'react-split-pane';

import Workspace from './Workspace';

import type { Sandbox } from '../../../../store/entities/sandboxes/entity';
import Content from './Content';

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
        <Content sandbox={sandbox} />
      </SplitPane>
    );
  }
}
