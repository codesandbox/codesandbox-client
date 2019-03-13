// @flow
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { reaction } from 'mobx';
import { TextOperation } from 'ot';
import { inject, observer } from 'mobx-react';

import getTemplateDefinition from 'common/lib/templates';
import type { ModuleError } from 'common/lib/types';
import { getPreviewTabs } from 'common/lib/templates/devtools';
import SplitPane from 'react-split-pane';

import CodeEditor from 'app/components/CodeEditor';
import type { Editor, Settings } from 'app/components/CodeEditor/types';
import DevTools from 'app/components/Preview/DevTools';

import preventGestureScroll, { removeListener } from './prevent-gesture-scroll';
import Tabs from './Tabs';
import Preview from './Preview';

const settings = store =>
  ({
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
  }: Settings);

type Props = {
  signals: any,
  store: any,
};

type State = {
  width: ?number,
  height: ?number,
};

class EditorPreview extends React.Component<Props, State> {
  state = { width: null, height: null };
  interval: IntervalID; // eslint-disable-line
  disposeEditorChange: Function;
  el: ?HTMLElement;
  devtools: DevTools;
  contentNode: ?HTMLElement;

  componentDidMount() {
    this.props.signals.editor.contentMounted();
    this.disposeEditorChange = reaction(
      () => this.props.store.preferences.settings.codeMirror,
      () => this.forceUpdate()
    );

    window.addEventListener('resize', this.getBounds);

    this.interval = setInterval(() => {
      this.getBounds();
    }, 1000);

    if (this.contentNode) {
      preventGestureScroll(this.contentNode);
    }
  }

  componentWillUnmount() {
    this.disposeEditorChange();
    window.removeEventListener('resize', this.getBounds);
    clearInterval(this.interval);

    if (this.contenNode) {
      removeListener(this.contentNode);
    }
  }

  getBounds = el => {
    if (el) {
      this.el = this.el || el;
    }
    if (this.el) {
      const { width, height } = this.el.getBoundingClientRect();

      if (width !== this.state.width || height !== this.state.height) {
        this.setState({ width, height });
      }
    }
  };

  handleToggleDevtools = showDevtools => {
    if (this.devtools) {
      if (showDevtools) {
        this.devtools.openDevTools();
      } else {
        this.devtools.hideDevTools();
      }
    }
  };

  onInitialized = (editor: Editor) => {
    const store = this.props.store;
    let isChangingSandbox = false;

    const disposeSandboxChangeHandler = reaction(
      () => store.editor.currentSandbox,
      newSandbox => {
        isChangingSandbox = !!editor.changeSandbox;

        // Put in a timeout so we allow the actions after the fork to execute first as well.
        setTimeout(() => {
          if (editor.changeSandbox) {
            const { parsed } = store.editor.parsedConfigurations.package;
            editor
              .changeSandbox(
                newSandbox,
                store.editor.currentModule,
                parsed ? parsed.dependencies : newSandbox.npmDependencies.toJS()
              )
              .then(() => {
                isChangingSandbox = false;
              });
          }
        });
      }
    );
    const disposeErrorsHandler = reaction(
      () => store.editor.errors.map(error => error),
      (errors: Array<ModuleError>) => {
        if (editor.setErrors) {
          editor.setErrors(errors);
        }
      }
    );
    const disposeCorrectionsHandler = reaction(
      () => store.editor.corrections.map(correction => correction),
      corrections => {
        if (editor.setCorrections) {
          editor.setCorrections(corrections);
        }
      }
    );
    const disposeGlyphsHandler = reaction(
      () => store.editor.glyphs.map(glyph => glyph),
      glyphs => {
        if (editor.setGlyphs) {
          editor.setGlyphs(glyphs);
        }
      }
    );
    const disposeModulesHandler = reaction(this.detectStructureChange, () => {
      if (isChangingSandbox) {
        return;
      }
      if (editor.updateModules) {
        editor.updateModules();
      }
    });
    const disposePreferencesHandler = reaction(
      () => settings(store),
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
      () => [
        store.preferences.settings.zenMode,
        store.workspace.workspaceHidden,
        store.editor.previewWindowOrientation,
      ],
      () => {
        setTimeout(() => {
          this.getBounds();
        });
      }
    );
    const disposePackageHandler = reaction(
      () => store.editor.parsedConfigurations.package,
      () => {
        const { parsed } = store.editor.parsedConfigurations.package;
        if (parsed) {
          const { dependencies = {} } = parsed;

          if (editor.changeDependencies) {
            editor.changeDependencies(dependencies);
          }
        }
      }
    );
    const disposeTSConfigHandler = reaction(
      () => store.editor.parsedConfigurations.typescript,
      () => {
        if (store.editor.parsedConfigurations.typescript) {
          const { parsed } = store.editor.parsedConfigurations.typescript;
          if (parsed) {
            if (editor.setTSConfig) {
              editor.setTSConfig(parsed);
            }
          }
        }
      }
    );
    const disposeLiveHandler = reaction(
      () => store.live.receivingCode,
      () => {
        if (editor.setReceivingCode) {
          editor.setReceivingCode(store.live.receivingCode);
        }
      }
    );

    const disposeModuleSyncedHandler = reaction(
      () => store.editor.changedModuleShortids.map(shortid => shortid),
      () => {
        if (editor.moduleSyncedChanged) {
          editor.moduleSyncedChanged();
        }
      }
    );

    const disposePendingOperationHandler = reaction(
      () => store.editor.pendingOperations.toJSON(),
      () => {
        if (store.live.isLive) {
          if (store.editor.pendingOperations) {
            if (editor.setReceivingCode) {
              editor.setReceivingCode(true);
            }
            if (editor.applyOperations) {
              editor.applyOperations(store.editor.pendingOperations);
            } else {
              try {
                store.editor.pendingOperations.forEach(
                  (operationJSON, moduleShortid) => {
                    const operation = TextOperation.fromJSON(operationJSON);

                    const module = store.currentSandbox.modules.find(
                      m => m.shortid === moduleShortid
                    );

                    if (!module) {
                      throw new Error(
                        'Cannot find module with shortid: ' + moduleShortid
                      );
                    }

                    this.props.signals.editor.codeChanged({
                      code: operation.apply(module.code || ''),
                      moduleShortid: module.shortid,
                    });
                  }
                );
              } catch (e) {
                console.error(e);
              }
            }
            if (editor.setReceivingCode) {
              editor.setReceivingCode(false);
            }
            this.props.signals.live.onOperationApplied();
          }
        }
      }
    );

    const updateUserSelections = () => {
      if (store.editor.pendingUserSelections) {
        if (editor.updateUserSelections) {
          if (store.live.isLive) {
            requestAnimationFrame(() => {
              editor.updateUserSelections(store.editor.pendingUserSelections);
              this.props.signals.live.onSelectionDecorationsApplied();
            });
          } else {
            this.props.signals.live.onSelectionDecorationsApplied();
          }
        }
      }
    };
    const disposeLiveSelectionHandler = reaction(
      () => store.editor.pendingUserSelections.map(x => x),
      updateUserSelections
    );
    updateUserSelections();

    const disposeModuleHandler = reaction(
      () => [store.editor.currentModule, store.editor.currentModule.code],
      ([newModule]) => {
        if (isChangingSandbox) {
          return;
        }

        const editorModule = editor.currentModule;
        const changeModule = editor.changeModule;
        if (
          (!editorModule || newModule.id !== editorModule.id) &&
          changeModule
        ) {
          const errors = store.editor.errors.map(e => e);
          const corrections = store.editor.corrections.map(e => e);
          changeModule(newModule, errors, corrections);
        } else if (editor.changeCode) {
          // Only code changed from outside the editor
          editor.changeCode(newModule.code || '', newModule.id);
        }
      }
    );
    const disposeToggleDevtools = reaction(
      () => this.props.store.preferences.showDevtools,
      showDevtools => {
        this.handleToggleDevtools(showDevtools);
      }
    );
    const disposeTogglePreview = reaction(
      () => this.props.store.editor.previewWindowVisible,
      () => {
        requestAnimationFrame(() => {
          this.getBounds();
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
      disposeGlyphsHandler();
      disposeLiveHandler();
      disposePendingOperationHandler();
      disposeLiveSelectionHandler();
      disposeTogglePreview();
      disposeModuleSyncedHandler();
    };
  };

  detectStructureChange = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return String(
      sandbox.modules
        .map(module => module.id + module.directoryShortid + module.title)
        .concat(
          sandbox.directories.map(
            directory => directory.directoryShortid + directory.title
          )
        )
    );
  };

  sendTransforms = operation => {
    const currentModuleShortid = this.props.store.editor.currentModuleShortid;

    this.props.signals.live.onTransformMade({
      moduleShortid: currentModuleShortid,
      operation: operation.toJSON(),
    });
  };

  moveDevToolsTab = (prevPos, nextPos) => {
    const { store, signals } = this.props;
    const tabs = getPreviewTabs(store.editor.currentSandbox);

    const prevDevTools = tabs[prevPos.devToolIndex];
    const nextDevTools = tabs[nextPos.devToolIndex];
    const prevTab = tabs[prevPos.devToolIndex].views[prevPos.tabPosition];

    prevDevTools.views = prevDevTools.views.filter(
      (_, i) => i !== prevPos.tabPosition
    );

    nextDevTools.views.splice(nextPos.tabPosition, 0, prevTab);

    const newTabs = tabs.map((t, i) => {
      if (i === prevPos.devToolIndex) {
        return prevDevTools;
      } else if (i === nextPos.devToolIndex) {
        return nextDevTools;
      }

      return t;
    });

    const code = JSON.stringify({ preview: newTabs }, null, 2);
    const previousFile =
      store.editor.modulesByPath['/.codesandbox/workspace.json'];
    if (previousFile) {
      signals.editor.codeSaved({
        code,
        moduleShortid: previousFile.shortid,
      });
    } else {
      signals.files.createModulesByPath({
        files: {
          '/.codesandbox/workspace.json': {
            content: code,
            isBinary: false,
          },
        },
      });
    }
  };

  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.preferences;
    const currentTab = store.editor.currentTab;

    const windowVisible = store.editor.previewWindowVisible;

    const { width: absoluteWidth, height: absoluteHeight } = this.state;

    const editorWidth = absoluteWidth;
    const editorHeight = absoluteHeight;

    const template = getTemplateDefinition(sandbox.template);

    const isReadOnly = () => {
      if (store.live.isLive) {
        if (
          !store.live.isCurrentEditor ||
          (store.live.roomInfo && store.live.roomInfo.ownerIds.length === 0)
        ) {
          return true;
        }
      }

      if (template.isServer) {
        if (!store.isLoggedIn || store.server.status !== 'connected') {
          return true;
        }
      }

      return false;
    };

    const views = getPreviewTabs(sandbox);

    const sandboxConfig = sandbox.modules.find(
      x => x.directoryShortid == null && x.title === 'sandbox.config.json'
    );

    let view = 'browser';
    if (sandboxConfig) {
      try {
        view = JSON.parse(sandboxConfig.code || '').view || 'browser';
      } catch (e) {
        /* swallow */
      }
    }

    if (view !== 'browser') {
      // Backwards compatibility for sandbox.config.json
      if (view === 'console') {
        views[0].views.unshift({ id: 'codesandbox.console' });
      } else if (view === 'tests') {
        views[0].views.unshift({ id: 'codesandbox.tests' });
      }
    }

    const browserConfig = {
      id: 'codesandbox.browser',
      title: 'Browser',
      Content: ({ hidden }) => (
        <Preview hidden={hidden} width={'100%'} height={'100%'} />
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
          ref={node => {
            if (node) {
              this.contentNode = node;
            }
          }}
        >
          <Prompt
            when={notSynced && !store.editor.isForkingSandbox}
            message={() =>
              'You have not saved this sandbox, are you sure you want to navigate away?'
            }
          />
          <SplitPane
            onDragFinished={() => {
              this.props.signals.editor.resizingStopped();
            }}
            onDragStarted={() => {
              this.props.signals.editor.resizingStarted();
            }}
            onChange={() => {
              requestAnimationFrame(() => {
                this.getBounds();
              });
            }}
            style={{
              overflow: 'visible', // For VSCode Context Menu
            }}
            split={this.props.store.editor.previewWindowOrientation}
            defaultSize={'50%'}
            pane1Style={
              windowVisible
                ? {}
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
              ref={this.getBounds}
              style={{
                position: 'relative',
                display: 'flex',
                flex: 1,
                height: '100%',
                width: '100%',
                marginTop: 0,
              }}
            >
              {!store.preferences.settings.experimentVSCode && <Tabs />}
              <CodeEditor
                style={{
                  top: store.preferences.settings.experimentVSCode ? 0 : 35,
                }}
                onInitialized={this.onInitialized}
                sandbox={sandbox}
                currentTab={currentTab}
                currentModule={currentModule}
                isModuleSynced={store.editor.isModuleSynced}
                width={editorWidth}
                height={editorHeight}
                absoluteWidth={absoluteWidth}
                absoluteHeight={absoluteHeight}
                settings={settings(store)}
                sendTransforms={this.sendTransforms}
                readOnly={isReadOnly()}
                isLive={store.live.isLive}
                onCodeReceived={signals.live.onCodeReceived}
                onSelectionChanged={signals.live.onSelectionChanged}
                onNpmDependencyAdded={name => {
                  if (sandbox.owned) {
                    signals.editor.addNpmDependency({ name, isDev: true });
                  }
                }}
                onChange={(code, moduleShortid) =>
                  signals.editor.codeChanged({
                    code,
                    moduleShortid: moduleShortid || currentModule.shortid,
                    noLive: true,
                  })
                }
                onModuleChange={moduleId =>
                  signals.editor.moduleSelected({ id: moduleId })
                }
                onModuleStateMismatch={signals.live.onModuleStateMismatch}
                onSave={code =>
                  signals.editor.codeSaved({
                    code,
                    moduleShortid: currentModule.shortid,
                  })
                }
                tsconfig={
                  store.editor.parsedConfigurations.typescript &&
                  store.editor.parsedConfigurations.typescript.parsed
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
                  devToolIndex={i}
                  addedViews={{
                    'codesandbox.browser': browserConfig,
                  }}
                  setDragging={dragging => {
                    if (dragging) {
                      this.props.signals.editor.resizingStarted();
                    } else {
                      this.props.signals.editor.resizingStopped();
                    }
                  }}
                  sandboxId={sandbox.id}
                  template={sandbox.template}
                  shouldExpandDevTools={store.preferences.showDevtools}
                  zenMode={preferences.settings.zenMode}
                  setDevToolsOpen={open =>
                    this.props.signals.preferences.setDevtoolsOpen({ open })
                  }
                  owned={sandbox.owned}
                  primary={i === 0}
                  viewConfig={v}
                  moveTab={this.moveDevToolsTab}
                />
              ))}
            </div>
          </SplitPane>
        </div>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(EditorPreview));
