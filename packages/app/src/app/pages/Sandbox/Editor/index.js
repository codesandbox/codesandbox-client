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
};

type State = {
  resizing: boolean,
  workspaceHidden: boolean,
};

export default class ContentSplit extends React.PureComponent<Props, State> {
  state = {
    resizing: false,
    workspaceHidden: this.props.zenMode,
  };

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  timeout: number;
  shiftPressed: boolean;

  handleKeyPress = (e: KeyboardEvent) => {
    // Handle double shift press for toggling the workspace
    if (e.keyCode === 16) {
      if (!this.shiftPressed) {
        this.shiftPressed = true;
        this.timeout = setTimeout(() => {
          this.shiftPressed = false;
        }, 500);
      } else {
        this.toggleWorkspace();
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  toggleWorkspace = () =>
    this.setState({ workspaceHidden: !this.state.workspaceHidden });

  render() {
    const { sandbox, match } = this.props;
    const { resizing, workspaceHidden } = this.state;
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
