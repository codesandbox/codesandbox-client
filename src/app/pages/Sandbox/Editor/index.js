/* @flow */
import * as React from 'react';
import SplitPane from 'react-split-pane';
import type { Sandbox } from 'common/types';

import Fullscreen from 'app/components/flex/Fullscreen';

import Workspace from './Workspace';

import Content from './Content';

type Props = {
  sandbox: Sandbox,
  match: Object,
};

type State = {
  resizing: boolean,
  workspaceHidden: boolean,
};

export default class ContentSplit extends React.PureComponent<Props, State> {
  state = {
    resizing: false,
    workspaceHidden: false,
  };

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  toggleWorkspace = () =>
    this.setState({ workspaceHidden: !this.state.workspaceHidden });

  render() {
    const { sandbox, match } = this.props;
    const { resizing, workspaceHidden } = this.state;
    return (
      <Fullscreen style={{ position: 'relative' }}>
        <SplitPane
          split="vertical"
          defaultSize={16 * 16}
          style={{ top: 0 }}
          onDragStarted={this.startResizing}
          onDragFinished={this.stopResizing}
          resizerStyle={{ visibility: workspaceHidden ? 'hidden' : 'visible' }}
          pane1Style={{
            visibility: workspaceHidden ? 'hidden' : 'visible',
            maxWidth: workspaceHidden ? 0 : 'inherit',
          }}
        >
          {!workspaceHidden && <Workspace sandbox={sandbox} />}
          <Content
            workspaceHidden={workspaceHidden}
            toggleWorkspace={this.toggleWorkspace}
            sandbox={sandbox}
            resizing={resizing}
            match={match}
          />
        </SplitPane>
      </Fullscreen>
    );
  }
}
