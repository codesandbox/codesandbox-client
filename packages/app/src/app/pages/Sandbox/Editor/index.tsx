import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import { useOvermind } from 'app/overmind';
import { templateColor } from 'app/utils/template-color';
import React, { useEffect, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import styled, { ThemeProvider } from 'styled-components';

import Content from './Content';
import { Container } from './elements';
import ForkFrozenSandboxModal from './ForkFrozenSandboxModal';
import { Header } from './Header';
import { Navigation } from './Navigation';
import getVSCodeTheme from './utils/get-vscode-theme';
import { Workspace } from './Workspace';

const STATUS_BAR_SIZE = 22;

const StatusBar = styled.div`
  a {
    color: inherit;
  }
`;

const ContentSplit: React.FC = () => {
  const { state, actions, effects } = useOvermind();
  const statusbarEl = useRef(null);
  const [localState, setLocalState] = useState({
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme: state.preferences.settings.customVSCodeTheme,
  });

  useEffect(() => {
    async function loadTheme() {
      const { customVSCodeTheme } = state.preferences.settings;

      try {
        const theme = await getVSCodeTheme('', customVSCodeTheme);
        setLocalState({ theme, customVSCodeTheme });
      } catch (e) {
        console.error(e);
      }
    }
    if (
      localState.customVSCodeTheme !==
      state.preferences.settings.customVSCodeTheme
    ) {
      loadTheme();
    }
  }, [localState.customVSCodeTheme, state.preferences.settings]);

  useEffect(() => {
    statusbarEl.current.appendChild(effects.vscode.getStatusbarElement());
  }, [effects.vscode]);

  const sandbox = state.editor.currentSandbox;
  const hideNavigation =
    state.preferences.settings.zenMode && state.workspace.workspaceHidden;
  const { statusBar } = state.editor;

  const templateDef = sandbox && getTemplateDefinition(sandbox.template);

  const topOffset = state.preferences.settings.zenMode ? 0 : 3 * 16;
  const bottomOffset = STATUS_BAR_SIZE;

  return (
    <ThemeProvider
      theme={{
        templateColor: templateColor(sandbox, templateDef as any),
        templateBackgroundColor: templateDef && templateDef.backgroundColor,
        ...localState.theme,
      }}
    >
      <Container style={{ lineHeight: 'initial' }} className="monaco-workbench">
        <Header zenMode={state.preferences.settings.zenMode} />

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
              height: statusBar ? 'auto' : 'calc(100% - 3.5rem)',
            }}
          >
            <SplitPane
              split="vertical"
              defaultSize={17 * 16}
              minSize={0}
              onDragStarted={() => actions.editor.resizingStarted()}
              onDragFinished={() => actions.editor.resizingStopped()}
              onChange={size => {
                if (size > 0 && state.workspace.workspaceHidden) {
                  actions.workspace.setWorkspaceHidden({ hidden: false });
                } else if (size === 0 && !state.workspace.workspaceHidden) {
                  actions.workspace.setWorkspaceHidden({ hidden: true });
                }
              }}
              pane1Style={{
                visibility: state.workspace.workspaceHidden
                  ? 'hidden'
                  : 'visible',
                maxWidth: state.workspace.workspaceHidden ? 0 : 'inherit',
              }}
              pane2Style={{
                height: '100%',
              }}
              style={{
                overflow: 'visible', // For VSCode Context Menu
              }}
            >
              {state.workspace.workspaceHidden ? <div /> : <Workspace />}
              <Content />
            </SplitPane>

            <StatusBar
              style={{
                position: 'fixed',
                display: statusBar ? 'block' : 'none',
                bottom: 0,
                left: 0,
                right: 0,
                height: STATUS_BAR_SIZE,
              }}
              className="monaco-workbench mac nopanel"
              ref={statusbarEl}
            />
          </div>
        </Fullscreen>
        <ForkFrozenSandboxModal />
      </Container>
    </ThemeProvider>
  );
};

export default ContentSplit;
