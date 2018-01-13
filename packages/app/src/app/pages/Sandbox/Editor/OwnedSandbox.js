import React from 'react';
import { inject, observer } from 'mobx-react';

import SplitPane from 'react-split-pane';
import Workspace from './Workspace';
import Content from './Content';
import Navigation from './Navigation';

function OwnedSandbox({ signals, store, match }) {
  const hideNavigation =
    store.preferences.settings.zenMode && !store.workspace.openedWorkspaceItem;

  return (
    <React.Fragment>
      {!hideNavigation && <Navigation />}

      <div
        style={{
          position: 'fixed',
          left: hideNavigation ? 0 : '4rem',
          top: store.preferences.settings.zenMode ? 0 : '3rem',
          right: 0,
          bottom: 0,
        }}
      >
        <SplitPane
          split="vertical"
          defaultSize={16 * 16}
          onDragStarted={() => signals.editor.resizingStarted()}
          onDragFinished={() => signals.editor.resizingStopped()}
          resizerStyle={{
            visibility: store.workspace.openedWorkspaceItem
              ? 'visible'
              : 'hidden',
          }}
          pane1Style={{
            visibility: store.workspace.openedWorkspaceItem
              ? 'visible'
              : 'hidden',
            maxWidth: store.workspace.openedWorkspaceItem ? 'inherit' : 0,
          }}
        >
          {store.workspace.openedWorkspaceItem && <Workspace />}
          <Content match={match} />
        </SplitPane>
      </div>
    </React.Fragment>
  );
}

export default inject('signals', 'store')(observer(OwnedSandbox));
