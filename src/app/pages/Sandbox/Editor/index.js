/* @flow */
import React from 'react';
import SplitPane from 'react-split-pane';
import type { Sandbox } from 'app/store/entities/sandboxes/entity';

import Workspace from './Workspace';

import Content from './Content';

type Props = {
  sandbox: Sandbox,
  match: Object,
};

export default class ContentSplit extends React.PureComponent {
  props: Props;
  state = { resizing: false };

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  render() {
    const { sandbox, match } = this.props;
    const { resizing } = this.state;
    return (
      <SplitPane
        split="vertical"
        minSize={100}
        defaultSize={16 * 16}
        style={{ top: 0 }}
        onDragStarted={this.startResizing}
        onDragFinished={this.stopResizing}
      >
        <Workspace sandbox={sandbox} />
        <Content sandbox={sandbox} resizing={resizing} match={match} />
      </SplitPane>
    );
  }
}
