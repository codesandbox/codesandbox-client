import * as React from 'react';
import SplitPane from 'react-split-pane';
import { inject, observer } from 'mobx-react';
import Fullscreen from 'common/components/flex/Fullscreen';

import Workspace from './Workspace';
import Content from './Content';
import Header from './Header';
import Navigation from './Navigation';

function ContentSplit({ signals, store, match }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!store.preferences.settings.zenMode && <Header />}

      <Fullscreen>
        <Navigation />

        <div
          style={{
            position: 'fixed',
            left: '4rem',
            top: '3rem',
            right: 0,
            bottom: 0,
          }}
        >
          <SplitPane
            split="vertical"
            defaultSize={18 * 16}
            minSize={14 * 16}
            onDragStarted={() => signals.editor.resizingStarted()}
            onDragFinished={() => signals.editor.resizingStopped()}
            resizerStyle={{
              visibility: store.workspace.isWorkspaceHidden
                ? 'hidden'
                : 'visible',
            }}
            pane1Style={{
              visibility: store.workspace.isWorkspaceHidden
                ? 'hidden'
                : 'visible',
              maxWidth: store.workspace.isWorkspaceHidden ? 0 : 'inherit',
            }}
          >
            {!store.workspace.isWorkspaceHidden && <Workspace />}
            <Content match={match} />
          </SplitPane>
        </div>
      </Fullscreen>
    </div>
  );
}

export default inject('signals', 'store')(observer(ContentSplit));
