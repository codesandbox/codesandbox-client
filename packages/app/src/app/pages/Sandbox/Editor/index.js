import * as React from 'react';
import SplitPane from 'react-split-pane';
import { inject, observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';

import Fullscreen from 'common/components/flex/Fullscreen';
import getTemplateDefinition from 'common/templates';
import codesandbox from 'common/themes/codesandbox.json';

import { Container } from './elements';
import Workspace from './Workspace';
import Content from './Content';
import Header from './Header';
import Navigation from './Navigation';
import getVSCodeTheme from './utils/get-vscode-theme';

class ContentSplit extends React.Component {
  state = {
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    editorTheme: this.props.store.preferences.settings.editorTheme,
    customVSCodeTheme: this.props.store.preferences.settings.customVSCodeTheme,
  };

  componentDidMount() {
    this.loadTheme();
  }

  componentDidUpdate() {
    if (
      this.props.store.preferences.settings.editorTheme !==
        this.state.editorTheme ||
      this.props.store.preferences.settings.customVSCodeTheme !==
        this.state.customVSCodeTheme
    ) {
      this.loadTheme();
    }
  }

  loadTheme = async () => {
    const newThemeName = this.props.store.preferences.settings.editorTheme;
    const customVSCodeTheme = this.props.store.preferences.settings
      .customVSCodeTheme;

    try {
      const theme = await getVSCodeTheme(newThemeName, customVSCodeTheme);
      this.setState({ theme, editorTheme: newThemeName, customVSCodeTheme });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { signals, store, match } = this.props;
    const sandbox = store.editor.currentSandbox;
    const sandboxOwned = sandbox.owned;

    // Force MobX to update this component by observing the following value
    this.props.store.preferences.settings.editorTheme; // eslint-disable-line
    this.props.store.preferences.settings.customVSCodeTheme; // eslint-disable-line

    const hideNavigation =
      (store.preferences.settings.zenMode &&
        !store.workspace.openedWorkspaceItem) ||
      !sandboxOwned;

    return (
      <ThemeProvider
        theme={{
          templateColor:
            sandbox && getTemplateDefinition(sandbox.template).color,
          ...this.state.theme,
        }}
      >
        <Container>
          {!store.preferences.settings.zenMode && <Header />}

          <Fullscreen>
            {!hideNavigation && <Navigation />}

            <div
              style={{
                position: 'fixed',
                left: hideNavigation ? 0 : 'calc(4rem + 1px)',
                top: store.preferences.settings.zenMode ? 0 : '3rem',
                right: 0,
                bottom: 0,
              }}
            >
              <SplitPane
                split="vertical"
                defaultSize={sandboxOwned ? 16 * 16 : 18 * 16}
                minSize={0}
                onDragStarted={() => signals.editor.resizingStarted()}
                onDragFinished={() => signals.editor.resizingStopped()}
                onChange={size => {
                  if (size > 0 && !store.workspace.openedWorkspaceItem) {
                    signals.workspace.setWorkspaceItem({ item: 'files' });
                  } else if (
                    size === 0 &&
                    store.workspace.openedWorkspaceItem
                  ) {
                    signals.workspace.setWorkspaceItem({ item: null });
                  }
                }}
                pane1Style={{
                  visibility: store.workspace.openedWorkspaceItem
                    ? 'visible'
                    : 'hidden',
                  maxWidth: store.workspace.openedWorkspaceItem ? 'inherit' : 0,
                }}
                pane2Style={{
                  height: '100%',
                }}
              >
                {store.workspace.openedWorkspaceItem && <Workspace />}
                <Content match={match} />
              </SplitPane>
            </div>
          </Fullscreen>
        </Container>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(ContentSplit));
