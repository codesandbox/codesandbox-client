import * as React from 'react';
import SplitPane from 'react-split-pane';
import { inject, observer } from 'mobx-react';
import Workspace from './Workspace';
import Content from './Content';

function ContentSplit({ signals, store, match }) {
  return (
    <SplitPane
      split="vertical"
      defaultSize={18 * 16}
      minSize={14 * 16}
      style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}
      onDragStarted={() => signals.editor.resizingStarted()}
      onDragFinished={() => signals.editor.resizingStopped()}
      resizerStyle={{
        visibility: store.editor.isWorkspaceHidden ? 'hidden' : 'visible',
      }}
      pane1Style={{
        visibility: store.editor.isWorkspaceHidden ? 'hidden' : 'visible',
        maxWidth: store.editor.isWorkspaceHidden ? 0 : 'inherit',
      }}
    >
      {!store.editor.isWorkspaceHidden && <Workspace />}
      <Content match={match} />
    </SplitPane>
  );
}

export default inject('signals', 'store')(observer(ContentSplit));
