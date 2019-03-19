import * as React from 'react';
import SplitPane from 'react-split-pane';
import { inject, observer } from 'mobx-react';
import styled, { ThemeProvider } from 'styled-components';

import Fullscreen from 'common/lib/components/flex/Fullscreen';
import getTemplateDefinition from 'common/lib/templates';
import codesandbox from 'common/lib/themes/codesandbox.json';

import { Container } from './elements';
import Workspace from './Workspace';
import Content from './Content';
import Header from './Header';
import Navigation from './Navigation';
import getVSCodeTheme from './utils/get-vscode-theme';

const STATUS_BAR_SIZE = 22;

const AOverride = styled.div`
  a {
    color: inherit;
  }
`;

class ContentSplit extends React.Component {
  state = {
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme: this.props.store.preferences.settings.customVSCodeTheme,
  };

  componentDidMount() {
    this.loadTheme();
  }

  componentDidUpdate() {
    if (
      this.props.store.preferences.settings.customVSCodeTheme !==
      this.state.customVSCodeTheme
    ) {
      this.loadTheme();
    }
  }

  loadTheme = async () => {
    const customVSCodeTheme = this.props.store.preferences.settings
      .customVSCodeTheme;

    try {
      const theme = await getVSCodeTheme('', customVSCodeTheme);
      this.setState({ theme, customVSCodeTheme });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { signals, store, match } = this.props;
    const sandbox = store.editor.currentSandbox;

    // Force MobX to update this component by observing the following value
    this.props.store.preferences.settings.customVSCodeTheme; // eslint-disable-line

    const vscode = this.props.store.preferences.settings.experimentVSCode;

    const hideNavigation =
      store.preferences.settings.zenMode && store.workspace.workspaceHidden;

    const templateDef = sandbox && getTemplateDefinition(sandbox.template);

    const topOffset = store.preferences.settings.zenMode ? 0 : 3 * 16;
    const bottomOffset = vscode ? STATUS_BAR_SIZE : 0;

    return (
      <ThemeProvider
        theme={{
          templateColor: templateDef && templateDef.color,
          templateBackgroundColor: templateDef && templateDef.backgroundColor,
          ...this.state.theme,
        }}
      >
        <Container
          style={{ lineHeight: 'initial' }}
          className="monaco-workbench"
        >
          <Header zenMode={store.preferences.settings.zenMode} />

          <Fullscreen style={{ width: 'initial' }}>
            {!hideNavigation && (
              <Navigation topOffset={topOffset} bottomOffset={bottomOffset} />
            )}

            <div
              style={{
                position: 'fixed',
                left: hideNavigation ? 0 : 'calc(3.5rem + 1px)',
                top: topOffset,
                right: 0,
                bottom: bottomOffset,
              }}
            >
              <SplitPane
                split="vertical"
                defaultSize={17 * 16}
                minSize={0}
                onDragStarted={() => signals.editor.resizingStarted()}
                onDragFinished={() => signals.editor.resizingStopped()}
                onChange={size => {
                  if (size > 0 && store.workspace.workspaceHidden) {
                    signals.workspace.setWorkspaceHidden({ hidden: false });
                  } else if (size === 0 && !store.workspace.workspaceHidden) {
                    signals.workspace.setWorkspaceHidden({ hidden: true });
                  }
                }}
                pane1Style={{
                  visibility: store.workspace.workspaceHidden
                    ? 'hidden'
                    : 'visible',
                  maxWidth: store.workspace.workspaceHidden ? 0 : 'inherit',
                }}
                pane2Style={{
                  height: '100%',
                }}
                style={{
                  overflow: 'visible', // For VSCode Context Menu
                }}
              >
                {store.workspace.workspaceHidden ? <div /> : <Workspace />}
                <Content match={match} />
              </SplitPane>

              {vscode && (
                <AOverride
                  style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: STATUS_BAR_SIZE,
                  }}
                  className="monaco-workbench mac nopanel"
                >
                  <div
                    className="part statusbar"
                    id="workbench.parts.statusbar"
                  />
                </AOverride>
              )}
            </div>
          </Fullscreen>
        </Container>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(ContentSplit));
