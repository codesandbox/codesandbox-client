import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import getTemplateDefinition from 'common/templates';

import CodeEditor from 'app/components/CodeEditor';
import DevTools from 'app/components/Preview/DevTools';
import FilePath from 'app/components/CodeEditor/FilePath';
import Preview from './Preview';

import Tabs from './Tabs';

import { FullSize } from './elements';

class EditorPreview extends React.Component {
  state = { width: null, height: null };

  componentDidMount() {
    this.props.signals.editor.contentMounted();
    this.disposeEditorChange = reaction(
      () => this.props.store.preferences.settings.codeMirror,
      () => this.forceUpdate()
    );

    window.addEventListener('resize', this.getBounds);
  }

  componentWillUnmount() {
    this.disposeEditorChange();
    window.removeEventListener('resize', this.getBounds);
  }

  getBounds = el => {
    if (el) {
      this.el = this.el || el;
    }
    if (this.el) {
      const { width, height } = this.el.getBoundingClientRect();

      this.setState({ width, height });
    }
  };

  setDevToolsOpen = (open: boolean) => {
    this.props.signals.preferences.setDevtoolsOpen({ open });
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

  onInitialized = editor => {
    const store = this.props.store;
    let isChangingSandbox = false;

    const disposeSandboxChangeHandler = reaction(
      () => store.editor.currentSandbox,
      newSandbox => {
        isChangingSandbox = true;

        // Put in a timeout so we allow the actions after the fork to execute first as well.
        setTimeout(() => {
          if (editor.changeSandbox) {
            editor
              .changeSandbox(
                newSandbox,
                store.editor.currentModule,
                newSandbox.npmDependencies.toJS()
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
      errors => {
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
    const disposeModulesHandler = reaction(this.detectStructureChange, () => {
      if (isChangingSandbox) {
        return;
      }
      if (editor.updateModules) {
        editor.updateModules();
      }
    });
    const disposePreferencesHandler = reaction(
      () => ({
        fontFamily: store.preferences.settings.fontFamily,
        fontSize: store.preferences.settings.fontSize,
        lineHeight: store.preferences.settings.lineHeight,
        autoCompleteEnabled: store.preferences.settings.autoCompleteEnabled,
        vimMode: store.preferences.settings.vimMode,
        lintEnabled: store.preferences.settings.lintEnabled,
        tabSize: store.preferences.settings.tabSize,
      }),
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
      () => store.editor.currentParsedPackageJSON,
      ({ parsed }) => {
        if (parsed) {
          const { dependencies = {} } = parsed;

          if (editor.changeDependencies) {
            editor.changeDependencies(dependencies);
          }
        }
      }
    );
    const disposeCodeHandler = reaction(
      () => store.editor.currentModule.code,
      newCode => {
        if (isChangingSandbox) {
          return;
        }
        if (editor.changeCode) {
          editor.changeCode(newCode || '');
        }
      }
    );
    const disposeModuleChangeHandler = reaction(
      () => store.editor.currentModule,
      newModule => {
        if (isChangingSandbox) {
          return;
        }
        if (editor.changeModule) {
          editor.changeModule(newModule);
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
      disposeSandboxChangeHandler();
      disposeModuleChangeHandler();
      disposeCodeHandler();
      disposeToggleDevtools();
      disposeResizeHandler();
    };
  };

  detectStructureChange = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return String(
      sandbox.modules
        .map(module => module.directoryShortid + module.title)
        .concat(
          sandbox.directories.map(
            directory => directory.directoryShortid + directory.title
          )
        )
    );
  };

  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.preferences;
    const { x, y, width } = store.editor.previewWindow;

    const windowRightSize = -x + width + 16;

    const isVerticalMode = this.state.width
      ? this.state.width / 4 > this.state.width - windowRightSize
      : false;

    const editorWidth = isVerticalMode
      ? '100%'
      : `calc(100% - ${windowRightSize}px)`;
    const editorHeight = isVerticalMode ? `${y + 16}px` : '100%';

    return (
      <ThemeProvider
        theme={{
          templateColor: getTemplateDefinition(sandbox.template).color,
        }}
      >
        <FullSize>
          <Prompt
            when={notSynced && !store.editor.isForkingSandbox}
            message={() =>
              'You have not saved this sandbox, are you sure you want to navigate away?'
            }
          />
          {preferences.settings.zenMode ? (
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
          )}
          <div
            ref={this.getBounds}
            style={{
              position: 'relative',
              display: 'flex',
              flex: 1,
            }}
          >
            <CodeEditor
              onInitialized={this.onInitialized}
              sandbox={sandbox}
              currentModule={currentModule}
              width={editorWidth}
              height={editorHeight}
              settings={{
                fontFamily: preferences.settings.fontFamily,
                fontSize: preferences.settings.fontSize,
                lineHeight: preferences.settings.lineHeight,
                autoCompleteEnabled: preferences.settings.autoCompleteEnabled,
                vimMode: preferences.settings.vimMode,
                lintEnabled: preferences.settings.lintEnabled,
                codeMirror: preferences.settings.codeMirror,
              }}
              onNpmDependencyAdded={name =>
                signals.workspace.onNpmDependencyAdded({ name })
              }
              onChange={code =>
                signals.editor.codeChanged({
                  code,
                  moduleShortid: currentModule.shortid,
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
            />
            <Preview width={this.state.width} height={this.state.height} />
          </div>

          <DevTools
            ref={component => {
              this.devtools = component;
            }}
            setDragging={() => this.props.signals.editor.resizingStarted()}
            sandboxId={sandbox.id}
            shouldExpandDevTools={store.preferences.showDevtools}
            zenMode={preferences.settings.zenMode}
            setDevToolsOpen={this.setDevToolsOpen}
          />
        </FullSize>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(EditorPreview));
