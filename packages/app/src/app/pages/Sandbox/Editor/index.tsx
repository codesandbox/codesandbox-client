import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Navigator from '@codesandbox/common/lib/components/Preview/Navigator';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import { ThemeProvider as NewThemeProvider } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { templateColor } from 'app/utils/template-color';
import React, { useEffect, useRef, useState } from 'react';
import SplitPane from 'react-split-pane';
import styled, { ThemeProvider } from 'styled-components';

import Content from './Content';
import {
  Container,
  SkeletonDevtools,
  SkeletonDevtoolsIframe,
  SkeletonDevtoolsNavigator,
  SkeletonDevtoolsTop,
  SkeletonEditor,
  SkeletonEditorTop,
  SkeletonExplorer,
  SkeletonExplorerTop,
  SkeletonWrapper,
} from './elements';
import ForkFrozenSandboxModal from './ForkFrozenSandboxModal';
import { Header } from './Header';
import { Header as HeaderOld } from './HeaderOld';
import { Navigation } from './Navigation';
import { Navigation as NavigationOld } from './NavigationOld';
import getVSCodeTheme from './utils/get-vscode-theme';
import { Workspace } from './Workspace';

const STATUS_BAR_SIZE = 22;

const StatusBar = styled.div`
  a {
    color: inherit;
  }
`;

const ContentSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonExplorer>
      <SkeletonExplorerTop />
    </SkeletonExplorer>
    <SkeletonEditor>
      <SkeletonEditorTop />
    </SkeletonEditor>
    <SkeletonDevtools>
      <SkeletonDevtoolsTop />
      <SkeletonDevtoolsNavigator>
        <Navigator
          url=""
          onChange={() => {}}
          onConfirm={() => {}}
          onRefresh={() => {}}
          isProjectView
        />
      </SkeletonDevtoolsNavigator>
      <SkeletonDevtoolsIframe />
    </SkeletonDevtools>
  </SkeletonWrapper>
);

const ContentSplit = () => {
  const { state, actions, effects } = useOvermind();
  const statusbarEl = useRef(null);
  const [localState, setLocalState] = useState({
    theme: {
      colors: {},
      vscodeTheme: codesandbox,
    },
    customVSCodeTheme: null,
  });

  useEffect(() => {
    async function loadTheme() {
      const vsCodeTheme = state.preferences.settings.customVSCodeTheme;

      try {
        const t = await getVSCodeTheme('', vsCodeTheme);
        setLocalState({ theme: t, customVSCodeTheme: vsCodeTheme });
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
  }, [
    localState.customVSCodeTheme,
    state.preferences.settings.customVSCodeTheme,
  ]);

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
      <Container
        style={{ lineHeight: 'initial', backgroundColor: 'transparent' }}
        className="monaco-workbench"
      >
        {true ? (
          <>
            {state.preferences.settings.zenMode ? null : (
              <NewThemeProvider theme={localState.theme.vscodeTheme}>
                <Header />
              </NewThemeProvider>
            )}
          </>
        ) : (
          <HeaderOld zenMode={state.preferences.settings.zenMode} />
        )}
        <Fullscreen style={{ width: 'initial' }}>
          {!hideNavigation &&
            (true ? (
              <NewThemeProvider theme={localState.theme.vscodeTheme}>
                <Navigation topOffset={topOffset} bottomOffset={bottomOffset} />
              </NewThemeProvider>
            ) : (
              <NavigationOld
                topOffset={topOffset}
                bottomOffset={bottomOffset}
              />
            ))}

          <div
            style={{
              position: 'fixed',
              left: hideNavigation ? 0 : 'calc(3.5rem + 1px)',
              top: topOffset,
              right: 0,
              bottom: bottomOffset,
              height: statusBar ? 'auto' : 'calc(100% - 3.5rem)',
              zIndex: 9,
            }}
          >
            {state.editor.isLoading ? (
              <ContentSkeleton />
            ) : (
              <SplitPane
                split="vertical"
                defaultSize={17 * 16}
                minSize={0}
                resizerStyle={
                  state.editor.isLoading ? { display: 'none' } : null
                }
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
                  minWidth: state.workspace.workspaceHidden ? 0 : 190,
                  visibility: state.workspace.workspaceHidden
                    ? 'hidden'
                    : 'visible',
                  maxWidth: state.workspace.workspaceHidden ? 0 : 400,
                }}
                pane2Style={{
                  height: '100%',
                }}
                style={{
                  overflow: 'visible', // For VSCode Context Menu
                }}
              >
                {state.workspace.workspaceHidden ? <div /> : <Workspace />}
                {<Content theme={localState.theme} />}
              </SplitPane>
            )}
          </div>

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
        </Fullscreen>

        <ForkFrozenSandboxModal />
      </Container>
    </ThemeProvider>
  );
};

export default ContentSplit;
