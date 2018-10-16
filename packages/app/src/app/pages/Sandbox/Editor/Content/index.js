// @flow
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { reaction } from 'mobx';
import { TextOperation } from 'ot';
import { inject, observer } from 'mobx-react';
import getTemplateDefinition from 'common/templates';
import type { ModuleError } from 'common/types';

import CodeEditor from 'app/components/CodeEditor';
import type { Editor, Settings } from 'app/components/CodeEditor/types';
import DevTools from 'app/components/Preview/DevTools';
import FilePath from 'app/components/CodeEditor/FilePath';

import Preview from './Preview';
import Tabs from './Tabs';
import preventGestureScroll, { removeListener } from './prevent-gesture-scroll';

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
        store.workspace.openedWorkspaceItem,
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

  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.preferences;
    const currentTab = store.editor.currentTab;
    const { x, y, width, content } = store.editor.previewWindow;

    const windowVisible = !!content;

    const windowRightSize = -x + width + 16;

    const { width: absoluteWidth, height: absoluteHeight } = this.state;
    const isVerticalMode = absoluteWidth
      ? absoluteWidth / 4 > absoluteWidth - windowRightSize
      : false;

    let editorWidth = isVerticalMode
      ? absoluteWidth
      : absoluteWidth - windowRightSize;
    let editorHeight = isVerticalMode ? y + 16 : absoluteHeight;

    if (!windowVisible) {
      editorWidth = absoluteWidth;
      editorHeight = absoluteHeight;
    }

    const template = getTemplateDefinition(sandbox.template);

    const isReadOnly = () => {
      if (store.live.isCurrentEditor) {
        return false;
      }

      if (template.isServer) {
        if (!store.isLoggedIn || store.server.status !== 'connected') {
          return true;
        }
      }

      return store.live.isLive;
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

            display: 'flex',
            flexDirection: 'column',
          }}
          innerRef={node => {
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
          {!preferences.settings.experimentVSCode &&
            (preferences.settings.zenMode ? (
              <FilePath
                modules={sandbox.modules}
                directories={sandbox.directories}
                currentModule={currentModule}
                workspaceHidden={!store.workspace.openedWorkspaceItem}
                toggleWorkspace={() => {
                  signals.workspace.toggleCurrentWorkspaceItem();
                }}
                exitZenMode={() =>
                  this.props.signals.preferences.settingChanged({
                    name: 'zenMode',
                    value: false,
                  })
                }
              />
            ) : (
              <Tabs />
            ))}
          <div
            ref={this.getBounds}
            style={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              marginTop:
                preferences.settings.experimentVSCode ||
                preferences.settings.zenMode
                  ? 0
                  : '2.5rem',
            }}
          >
            <CodeEditor
              onInitialized={this.onInitialized}
              sandbox={sandbox}
              currentTab={currentTab}
              currentModule={currentModule}
              isModuleSynced={store.editor.isModuleSynced(
                currentModule.shortid
              )}
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

            <Preview
              runOnClick={this.props.store.preferences.runOnClick}
              width={absoluteWidth}
              height={absoluteHeight}
            />
          </div>

          <DevTools
            ref={component => {
              if (component) {
                this.devtools = component;
              }
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
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(EditorPreview));
