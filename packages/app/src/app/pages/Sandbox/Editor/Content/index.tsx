import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import getDefinition from '@codesandbox/common/lib/templates';
import { Sandbox } from '@codesandbox/common/lib/types';
import { Icons } from 'app/components/CodeEditor/elements';
import { VSCode as CodeEditor } from 'app/components/CodeEditor/VSCode';
import { DevTools } from 'app/components/Preview/DevTools';
import { useOvermind } from 'app/overmind';
import debounce from 'lodash-es/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import QuestionIcon from 'react-icons/lib/go/question';
import { Prompt } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import { ThemeProvider } from 'styled-components';

import preventGestureScroll, { removeListener } from './prevent-gesture-scroll';
import { Preview } from './Preview';

/*
const settings = store => ({
  fontFamily: store.preferences.settings.fontFamily,
  fontSize: store.preferences.settings.fontSize,
  lineHeight: store.preferences.settings.lineHeight,
  autoCompleteEnabled: store.preferences.settings.autoCompleteEnabled,
  autoDownloadTypes: store.preferences.settings.autoDownloadTypes,
  vimMode: store.preferences.settings.vimMode,
  lintEnabled: store.preferences.settings.lintEnabled,
  codeMirror: store.preferences.settings.codeMirror,
  tabWidth: store.preferences.settings.prettierConfig
    ? store.preferences.settings.prettierConfig.tabWidth || 2
    : 2,
  enableLigatures: store.preferences.settings.enableLigatures,
  experimentVSCode: store.preferences.settings.experimentVSCode,
  prettierConfig: store.preferences.settings.prettierConfig,
  forceRefresh: store.preferences.settings.forceRefresh,
});
*/

// What is this thing?
const getDependencies = (sandbox: Sandbox): { [key: string]: string } => {
  const packageJSON = sandbox.modules.find(
    m => m.title === 'package.json' && m.directoryShortid == null
  );

  if (packageJSON != null) {
    try {
      const { dependencies = {}, devDependencies = {} } = JSON.parse(
        packageJSON.code || ''
      );

      const usedDevDependencies = {};
      Object.keys(devDependencies).forEach(d => {
        if (d.startsWith('@types')) {
          usedDevDependencies[d] = devDependencies[d];
        }
      });

      return { ...dependencies, ...usedDevDependencies };
    } catch (e) {
      console.error(e);
      return null;
    }
  } else {
    return sandbox.npmDependencies;
  }
};

export const Content: React.FC = () => {
  const editorEl = useRef(null);
  const contentEl = useRef(null);
  const [editorSize, changeEditorSize] = useState({
    width: 0,
    height: 0,
  });
  const getBounds = useCallback(
    debounce(function getBounds() {
      if (editorEl.current) {
        const { width, height } = editorEl.current.getBoundingClientRect();
        if (width !== editorSize.width || height !== editorSize.height) {
          changeEditorSize({ width, height });
        }
      }
    }, 200),
    [editorSize]
  );
  const { state, actions, effects, reaction } = useOvermind();

  useEffect(() => {
    const contentNode = contentEl.current;

    const disposeResizeDetector = reaction(
      ({ preferences, workspace, editor }) => [
        preferences.settings.zenMode,
        workspace.workspaceHidden,
        editor.previewWindowOrientation,
      ],
      () => {
        getBounds();
      },
      {
        immediate: true,
      }
    );

    preventGestureScroll(contentEl.current);

    return () => {
      effects.vscode.editor.unmount();
      window.removeEventListener('resize', getBounds);
      // clearInterval(this.interval);
      disposeResizeDetector();
      removeListener(contentNode);
    };
  }, [effects.vscode.editor, getBounds, reaction]);

  const { currentModule } = state.editor;
  const notSynced = !state.editor.isAllModulesSynced;
  const sandbox = state.editor.currentSandbox;
  const { preferences } = state;
  const { currentTab } = state.editor;
  const windowVisible = state.editor.previewWindowVisible;
  // getDefinition?? What is difference?
  const template = getDefinition(sandbox.template);
  const views = state.editor.devToolTabs;
  const currentPosition = state.editor.currentDevToolsPosition;
  const modulePath = getModulePath(
    sandbox.modules,
    sandbox.directories,
    currentModule.id
  );
  const config = template.configurationFiles[modulePath];

  const browserConfig = {
    id: 'codesandbox.browser',
    title: options =>
      options.port || options.title
        ? `Browser (${options.title || `:${options.port}`})`
        : `Browser`,
    Content: ({ hidden, options }) => (
      <Preview options={options} hidden={hidden} width="100%" height="100%" />
    ),
    actions: [],
  };

  function isReadOnly() {
    if (state.live.isLive) {
      if (
        !state.live.isCurrentEditor ||
        (state.live.roomInfo && state.live.roomInfo.ownerIds.length === 0)
      ) {
        return true;
      }
    }

    if (template.isServer) {
      if (!state.isLoggedIn || state.server.status !== 'connected') {
        return true;
      }
    }

    return false;
  }

  return (
    <ThemeProvider
      theme={{
        templateColor: template.color,
        templateBackgroundColor: template.backgroundColor,
      }}
    >
      <div
        id="workbench.main.container"
        style={{
          height: '100%',
          width: '100%',
          overflow: 'visible', // For VSCode Context Menu
          display: 'flex',
          flexDirection: 'column',
        }}
        ref={contentEl}
      >
        <Prompt
          when={notSynced && !state.editor.isForkingSandbox}
          message={() =>
            'You have not saved this sandbox, are you sure you want to navigate away?'
          }
        />
        <SplitPane
          maxSize={-100}
          onDragFinished={() => {
            actions.editor.resizingStopped();
          }}
          onDragStarted={() => {
            actions.editor.resizingStarted();
          }}
          onChange={() => {
            requestAnimationFrame(() => {
              getBounds();
            });
          }}
          style={{
            overflow: 'visible', // For VSCode Context Menu
          }}
          split={state.editor.previewWindowOrientation}
          defaultSize="50%"
          pane1Style={
            windowVisible
              ? {
                  minWidth: 100,
                }
              : {
                  width: '100%',
                  minWidth: '100%',
                  height: '100%',
                  minHeight: '100%',
                }
          }
          pane2Style={{
            visibility: windowVisible ? 'visible' : 'hidden',
            maxWidth: windowVisible ? 'inherit' : 0,
            width: windowVisible ? 'inherit' : 0,
            zIndex: 0, // For VSCode hovers, beware this is also dynamically changed in PreviewTabs
          }}
        >
          <div
            ref={editorEl}
            style={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              height: '100%',
              width: '100%',
              marginTop: 0,
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Icons>
                {config && config.partialSupportDisclaimer ? (
                  <Tooltip
                    placement="bottom"
                    content={config.partialSupportDisclaimer}
                    style={{
                      display: 'flex',
                      'align-items': 'center',
                    }}
                  >
                    Partially Supported Config{' '}
                    <QuestionIcon style={{ marginLeft: '.5rem' }} />
                  </Tooltip>
                ) : (
                  <div>Supported Configuration - What is this?</div>
                )}
              </Icons>
              <CodeEditor
                onInitialized={editor => {
                  // Just until we refactor the underlying editor
                  effects.vscode.editor.mount(editor);

                  return () => {};
                }}
                dependencies={getDependencies(sandbox)}
                sandbox={sandbox}
                currentTab={currentTab}
                currentModule={currentModule}
                isModuleSynced={shortId =>
                  !state.editor.changedModuleShortids.includes(shortId)
                }
                width={editorSize.width}
                height={editorSize.height}
                settings={state.preferences.settings}
                sendTransforms={operation => {
                  actions.live.onTransformMade({
                    moduleShortid: state.editor.currentModuleShortid,
                    operation: operation.toJSON(),
                  });
                }}
                readOnly={isReadOnly()}
                isLive={state.live.isLive}
                onCodeReceived={actions.live.onCodeReceived}
                onSelectionChanged={actions.live.onSelectionChanged}
                onNpmDependencyAdded={name => {
                  if (sandbox.owned) {
                    actions.editor.addNpmDependency({ name, isDev: true });
                  }
                }}
                onChange={(code, moduleShortid) =>
                  actions.editor.codeChanged({
                    code,
                    moduleShortid: moduleShortid || currentModule.shortid,
                    noLive: true,
                  })
                }
                onModuleChange={moduleId =>
                  actions.editor.moduleSelected({ id: moduleId })
                }
                onModuleStateMismatch={actions.live.onModuleStateMismatch}
                onSave={code =>
                  actions.editor.codeSaved({
                    code,
                    moduleShortid: currentModule.shortid,
                    cbID: null,
                  })
                }
                tsconfig={
                  state.editor.parsedConfigurations.typescript &&
                  state.editor.parsedConfigurations.typescript.parsed
                }
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
            id="csb-devtools" // used for tabs for highlighting
          >
            {views.map((v, i) => (
              <DevTools
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                devToolIndex={i}
                addedViews={{
                  'codesandbox.browser': browserConfig,
                }}
                setDragging={dragging => {
                  if (dragging) {
                    actions.editor.resizingStarted();
                  } else {
                    actions.editor.resizingStopped();
                  }
                }}
                sandboxId={sandbox.id}
                template={sandbox.template}
                shouldExpandDevTools={state.preferences.showDevtools}
                zenMode={preferences.settings.zenMode}
                setDevToolsOpen={open =>
                  actions.preferences.setDevtoolsOpen(open)
                }
                owned={sandbox.owned}
                primary={i === 0}
                viewConfig={v}
                moveTab={(prevPos, nextPos) => {
                  actions.editor.onDevToolsTabMoved({ prevPos, nextPos });
                }}
                closeTab={pos => {
                  actions.editor.onDevToolsTabClosed({ pos });
                }}
                currentDevToolIndex={currentPosition.devToolIndex}
                currentTabPosition={currentPosition.tabPosition}
                setPane={position =>
                  actions.editor.onDevToolsPositionChanged({
                    position,
                  })
                }
              />
            ))}
          </div>
        </SplitPane>
      </div>
    </ThemeProvider>
  );
};

export default Content;
