/* @flow */
import * as React from 'react';
import SplitPane from 'react-split-pane';
import type { Sandbox } from 'common/types';

import Workspace from './Workspace';
import Content from './Content';

type Props = {
  sandbox: Sandbox,
  match: Object,
  zenMode: boolean,
  workspaceHidden: boolean,
  setWorkspaceHidden: (hidden: boolean) => void,
};

type State = {
  resizing: boolean,
};

export default class ContentSplit extends React.PureComponent<Props, State> {
  state = {
    resizing: false,
  };

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  toggleWorkspace = () =>
    this.props.setWorkspaceHidden(!this.props.workspaceHidden);

  render() {
    const { sandbox, match, workspaceHidden } = this.props;
    const { resizing } = this.state;
    return (
      <SplitPane
        split="vertical"
        defaultSize={18 * 16}
        minSize={14 * 16}
        style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}
        onDragStarted={this.startResizing}
        onDragFinished={this.stopResizing}
        resizerStyle={{ visibility: workspaceHidden ? 'hidden' : 'visible' }}
        pane1Style={{
          visibility: workspaceHidden ? 'hidden' : 'visible',
          maxWidth: workspaceHidden ? 0 : 'inherit',
        }}
      >
        {!workspaceHidden && (
          <Workspace zenMode={this.props.zenMode} sandbox={sandbox} />
        )}
        <Content
          workspaceHidden={workspaceHidden}
          toggleWorkspace={this.toggleWorkspace}
          sandbox={sandbox}
          resizing={resizing}
          match={match}
        />
      </SplitPane>
    );
  }
}
