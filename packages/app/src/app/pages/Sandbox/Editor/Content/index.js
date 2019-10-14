/* eslint-disable no-shadow */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { json } from 'overmind';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { TextOperation } from 'ot';
import { clone } from 'app/componentConnectors';
import { useOvermind } from 'app/overmind';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import SplitPane from 'react-split-pane';

import { CodeEditor } from 'app/components/CodeEditor';
import { DevTools } from 'app/components/Preview/DevTools';

import { Preview } from './Preview';
import preventGestureScroll, { removeListener } from './prevent-gesture-scroll';
import Tabs from './Tabs';

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

const EditorPreview = ({ reaction }) => {
  const [editorWidth, setEditorWidth] = useState(null);
  const [editorHeight, setEditorHeight] = useState(null);
  const currentEl = useRef(null);
  const devtools = useRef(null);
  const contentNode = useRef(null);
  const {
    state,
    state: {
      isLoggedIn,
      editor: {
        currentModule,
        isAllModulesSynced,
        currentSandbox,
        currentTab,
        previewWindowVisible,
        previewWindowOrientation,
        parsedConfigurations,
        pendingOperations,
        pendingUserSelections,
        errors: errorStores,
        corrections: correctionStores,
        devToolTabs,
        currentDevToolsPosition,
        isForkingSandbox,
        changedModuleShortids,
        currentModuleShortid,
      },
      live: { isLive, receivingCode, isCurrentEditor, roomInfo },
      server: { status: serverStatus },
      preferences: {
        showDevtools,
        settings: { zenMode, experimentVSCode },
      },
    },
    actions: {
      editor: {
        codeSaved,
        codeChanged,
        moduleSelected,
        addNpmDependency,
        contentMounted,
        onDevToolsTabMoved,
        onDevToolsTabClosed,
        resizingStopped,
        resizingStarted,
        onDevToolsPositionChanged,
      },
      live: {
        onCodeReceived,
        onSelectionChanged,
        onModuleStateMismatch,
        onOperationApplied,
        onSelectionDecorationsApplied,

        onTransformMade,
      },
      preferences: { setDevtoolsOpen },
    },
  } = useOvermind();

  const notSynced = !isAllModulesSynced;
  const sandbox = currentSandbox;
  const windowVisible = previewWindowVisible;
  const template = getTemplateDefinition(sandbox.template);

  const getBounds = el => {
    if (el) {
      currentEl.current = currentEl.current || el;
    }
    if (currentEl.current) {
      const { width, height } = currentEl.current.getBoundingClientRect();
      if (width !== editorWidth || height !== editorHeight) {
        setEditorWidth(width);
        setEditorHeight(height);
      }
    }
  };

  const getBoundsCallback = useCallback(getBounds, []);
  useEffect(() => {
    contentMounted();
  }, [contentMounted]);

  useEffect(() => {
    window.addEventListener('resize', getBoundsCallback);
    return () => {
      window.removeEventListener('resize', getBoundsCallback);
    };
  }, [getBoundsCallback]);

  useEffect(() => {
    const interval = setInterval(() => {
      getBoundsCallback();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getBoundsCallback]);

  useEffect(() => {
    const localContentNode = contentNode.current;
    if (localContentNode) {
      preventGestureScroll(localContentNode);
    }
    return () => {
      if (localContentNode) {
        removeListener(localContentNode);
      }
    };
  }, []);

  useEffect(() => {
    const disposeEditorChange =
      reaction &&
      reaction(
        ({ preferences }) => preferences.settings.codeMirror
        // () => this.forceUpdate()
      );

    return () => {
      disposeEditorChange();
    };
  }, [reaction]);

  const handleToggleDevtools = showDevtools => {
    if (devtools.current) {
      if (showDevtools) {
        devtools.openDevTools();
      } else {
        devtools.hideDevTools();
      }
    }
  };

  const detectStructureChange = () =>
    String(
      sandbox.modules
        .map(module => module.id + module.directoryShortid + module.title)
        .concat(
          sandbox.directories.map(
            directory => directory.directoryShortid + directory.title
          )
        )
    );

  const onInitialized = editor => {
    let isChangingSandbox = false;

    const disposeSandboxChangeHandler = reaction(
      ({ editor: { currentSandbox } }) => currentSandbox,
      newSandbox => {
        isChangingSandbox = !!editor.changeSandbox;

        // Put in a timeout so we allow the actions after the fork to execute first as well.
        setTimeout(() => {
          if (editor.changeSandbox) {
            const { parsed } = parsedConfigurations.package;
            editor
              .changeSandbox(
                newSandbox,
                currentModule,
                // eslint-disable-next-line
                parsed
                  ? parsed.dependencies
                  : newSandbox.npmDependencies.toJS
                  ? newSandbox.npmDependencies.toJS()
                  : json(newSandbox.npmDependencies)
              )
              .then(() => {
                isChangingSandbox = false;
              });
          }
        });
      }
    );

    const disposeErrorsHandler = reaction(
      ({ editor: { errors } }) => errors.map(error => error),
      errors => {
        if (editor.setErrors) {
          editor.setErrors(errors);
        }
      }
    );

    const disposeCorrectionsHandler = reaction(
      ({ editor: { corrections } }) =>
        corrections.map(correction => correction),
      corrections => {
        if (editor.setCorrections) {
          editor.setCorrections(corrections);
        }
      }
    );

    const disposeModulesHandler = reaction(detectStructureChange, () => {
      if (isChangingSandbox) {
        return;
      }
      if (editor.updateModules) {
        editor.updateModules();
      }
    });

    const disposePreferencesHandler = reaction(
      state => settings(state),
      newSettings => {
        if (editor.changeSettings) {
          editor.changeSettings(newSettings);
        }
      },
      {
        compareStructural: true,
      }
    );

    const disposeResizeHandler = reaction(
      state => [
        state.preferences.settings.zenMode,
        state.workspace.workspaceHidden,
        state.editor.previewWindowOrientation,
      ],
      () => {
        setTimeout(() => {
          getBounds();
        });
      }
    );

    const disposePackageHandler = reaction(
      state => state.editor.parsedConfigurations.package,
      () => {
        const { parsed } = parsedConfigurations.package;
        if (parsed) {
          const { dependencies = {} } = parsed;

          if (editor.changeDependencies) {
            editor.changeDependencies(dependencies);
          }
        }
      }
    );

    const disposeTSConfigHandler = reaction(
      state => state.editor.parsedConfigurations.typescript,
      () => {
        if (parsedConfigurations.typescript) {
          const { parsed } = parsedConfigurations.typescript;
          if (parsed) {
            if (editor.setTSConfig) {
              editor.setTSConfig(parsed);
            }
          }
        }
      }
    );

    const disposeLiveHandler = reaction(
      state => state.live.receivingCode,
      () => {
        if (editor.setReceivingCode) {
          editor.setReceivingCode(receivingCode);
        }
      }
    );

    const disposeModuleSyncedHandler = reaction(
      state => state.editor.changedModuleShortids.map(shortid => shortid),
      () => {
        if (editor.moduleSyncedChanged) {
          editor.moduleSyncedChanged();
        }
      }
    );

    const disposePendingOperationHandler = reaction(
      state => clone(state.editor.pendingOperations),
      () => {
        if (isLive) {
          if (pendingOperations) {
            if (editor.setReceivingCode) {
              editor.setReceivingCode(true);
            }
            if (editor.applyOperations) {
              editor.applyOperations(pendingOperations);
            } else {
              try {
                pendingOperations.forEach((operationJSON, moduleShortid) => {
                  const operation = TextOperation.fromJSON(operationJSON);

                  const module = sandbox.modules.find(
                    m => m.shortid === moduleShortid
                  );

                  if (!module) {
                    throw new Error(
                      'Cannot find module with shortid: ' + moduleShortid
                    );
                  }

                  codeChanged({
                    code: operation.apply(module.code || ''),
                    moduleShortid: module.shortid,
                  });
                });
              } catch (e) {
                console.error(e);
              }
            }
            if (editor.setReceivingCode) {
              editor.setReceivingCode(false);
            }
            onOperationApplied();
          }
        }
      }
    );

    const updateUserSelections = () => {
      if (pendingUserSelections) {
        if (editor.updateUserSelections) {
          if (isLive) {
            requestAnimationFrame(() => {
              editor.updateUserSelections(pendingUserSelections);
              onSelectionDecorationsApplied();
            });
          } else {
            onSelectionDecorationsApplied();
          }
        }
      }
    };
    const disposeLiveSelectionHandler = reaction(
      state => state.editor.pendingUserSelections.map(x => x),
      updateUserSelections
    );
    updateUserSelections();

    const disposeModuleHandler = reaction(
      state => [state.editor.currentModule, state.editor.currentModule.code],
      ([newModule]) => {
        if (isChangingSandbox) {
          return;
        }

        const editorModule = editor.currentModule;
        const currentSandbox = editor.sandbox;
        const { changeModule } = editor;
        if (
          (!editorModule || newModule.id !== editorModule.id) &&
          changeModule
        ) {
          const errors = errorStores.map(e => e);
          const corrections = correctionStores.editor.corrections.map(e => e);

          if (currentSandbox.id !== sandbox.id && editor.changeSandbox) {
            // This means that the sandbox will be updated soon in the editor itself, which will
            // cause the module to change anyway. We don't want to continue here because the new sandbox
            // has not yet been initialized in the editor, but it's trying already to update the module.
            return;
          }

          changeModule(newModule, errors, corrections);
        } else if (editor.changeCode) {
          // Only code changed from outside the editor
          editor.changeCode(newModule.code || '', newModule.id);
        }
      }
    );
    const disposeToggleDevtools = reaction(
      state => state.preferences.showDevtools,
      showDevtools => {
        handleToggleDevtools(showDevtools);
      }
    );
    const disposeTogglePreview = reaction(
      state => state.editor.previewWindowVisible,
      () => {
        requestAnimationFrame(() => {
          getBounds();
        });
      }
    );

    return () => {
      disposeErrorsHandler();
      disposeCorrectionsHandler();
      disposeModulesHandler();
      disposePreferencesHandler();
      disposePackageHandler();
      disposeTSConfigHandler();
      disposeSandboxChangeHandler();
      disposeModuleHandler();
      disposeToggleDevtools();
      disposeResizeHandler();
      disposeLiveHandler();
      disposePendingOperationHandler();
      disposeLiveSelectionHandler();
      disposeTogglePreview();
      disposeModuleSyncedHandler();
    };
  };

  const sendTransforms = operation => {
    onTransformMade({
      moduleShortid: currentModuleShortid,
      operation: operation.toJSON(),
    });
  };

  const moveDevToolsTab = (prevPos, nextPos) => {
    onDevToolsTabMoved({ prevPos, nextPos });
  };

  const closeDevToolsTab = pos => {
    onDevToolsTabClosed({ pos });
  };

  const isReadOnly = () => {
    if (isLive) {
      if (!isCurrentEditor || (roomInfo && roomInfo.ownerIds.length === 0)) {
        return true;
      }
    }

    if (template.isServer) {
      if (!isLoggedIn || serverStatus !== 'connected') {
        return true;
      }
    }

    return false;
  };

  const views = devToolTabs;
  const currentPosition = currentDevToolsPosition;

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
        ref={contentNode}
      >
        <Prompt
          when={notSynced && !isForkingSandbox}
          message={() =>
            'You have not saved this sandbox, are you sure you want to navigate away?'
          }
        />
        <SplitPane
          maxSize={-100}
          onDragFinished={resizingStopped}
          onDragStarted={resizingStarted}
          onChange={() => {
            requestAnimationFrame(() => {
              getBounds();
            });
          }}
          style={{
            overflow: 'visible', // For VSCode Context Menu
          }}
          split={previewWindowOrientation}
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
            maxWidth: windowVisible ? '100%' : 0,
            width: windowVisible ? '100%' : 0,
            overflow: 'hidden',
            zIndex: 0, // For VSCode hovers, beware this is also dynamically changed in PreviewTabs
          }}
        >
          <div
            ref={getBounds}
            style={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              height: '100%',
              width: '100%',
              marginTop: 0,
            }}
          >
            {!experimentVSCode && <Tabs />}
            <CodeEditor
              style={{
                top: experimentVSCode ? 0 : 35,
              }}
              onInitialized={onInitialized}
              sandbox={sandbox}
              currentTab={currentTab}
              currentModule={currentModule}
              isModuleSynced={shortId =>
                !changedModuleShortids.includes(shortId)
              }
              width={editorWidth}
              height={editorHeight}
              settings={settings(state)}
              sendTransforms={sendTransforms}
              readOnly={isReadOnly()}
              isLive={isLive}
              onCodeReceived={onCodeReceived}
              onSelectionChanged={onSelectionChanged}
              onNpmDependencyAdded={name => {
                if (sandbox.owned) {
                  addNpmDependency({ name, isDev: true });
                }
              }}
              onChange={(code, moduleShortid) =>
                codeChanged({
                  code,
                  moduleShortid: moduleShortid || currentModule.shortid,
                  noLive: true,
                })
              }
              onModuleChange={moduleId => moduleSelected({ id: moduleId })}
              onModuleStateMismatch={onModuleStateMismatch}
              onSave={code =>
                codeSaved({
                  code,
                  moduleShortid: currentModule.shortid,
                })
              }
              tsconfig={
                parsedConfigurations.typescript &&
                parsedConfigurations.typescript.parsed
              }
            />
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
                key={i} // eslint-disable-line react/no-array-index-key
                ref={devtools}
                devToolIndex={i}
                addedViews={{
                  'codesandbox.browser': browserConfig,
                }}
                setDragging={dragging => {
                  if (dragging) {
                    resizingStarted();
                  } else {
                    resizingStopped();
                  }
                }}
                sandboxId={sandbox.id}
                template={sandbox.template}
                shouldExpandDevTools={showDevtools}
                zenMode={zenMode}
                setDevToolsOpen={open => setDevtoolsOpen({ open })}
                owned={sandbox.owned}
                primary={i === 0}
                viewConfig={v}
                moveTab={moveDevToolsTab}
                closeTab={closeDevToolsTab}
                currentDevToolIndex={currentPosition.devToolIndex}
                currentTabPosition={currentPosition.tabPosition}
                setPane={position =>
                  onDevToolsPositionChanged({
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

export default EditorPreview;
