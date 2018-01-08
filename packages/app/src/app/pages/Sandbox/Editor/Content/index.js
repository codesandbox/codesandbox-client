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
import Header from './Header';

import { FullSize } from './elements';

class EditorPreview extends React.Component {
  componentDidMount() {
    this.props.signals.editor.contentMounted();
    this.disposeEditorChange = reaction(
      () => this.props.store.preferences.settings.codeMirror,
      () => this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.disposeEditorChange();
  }

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
    );
    const disposeErrorsHandler = reaction(
      () => store.editor.errors.map(error => error),
      errors => {
        editor.setErrors(errors);
      }
    );
    const disposeCorrectionsHandler = reaction(
      () => store.editor.corrections.map(correction => correction),
      corrections => {
        editor.setCorrections(corrections);
      }
    );
    const disposeModulesHandler = reaction(
      () => store.editor.currentSandbox.modules.length,
      () => {
        if (isChangingSandbox) {
          return;
        }
        editor.updateModules();
      }
    );
    const disposePreferencesHandler = reaction(
      () => ({
        fontFamily: store.preferences.settings.fontFamily,
        fontSize: store.preferences.settings.fontSize,
        lineHeight: store.preferences.settings.lineHeight,
        autoCompleteEnabled: store.preferences.settings.autoCompleteEnabled,
        vimMode: store.preferences.settings.vimMode,
        lintEnabled: store.preferences.settings.lintEnabled,
      }),
      newSettings => {
        editor.changeSettings(newSettings);
      },
      {
        compareStructural: true,
      }
    );
    const disposeDependenciesHandler = reaction(
      () =>
        store.editor.currentSandbox.npmDependencies.keys().reduce(
          (dependencies, key) =>
            Object.assign(dependencies, {
              [key]: store.editor.currentSandbox.npmDependencies.get(key),
            }),
          {}
        ),
      newNpmDependencies => {
        editor.changeDependencies(newNpmDependencies);
      }
    );
    const disposeCodeHandler = reaction(
      () => store.editor.currentModule.code,
      newCode => {
        if (isChangingSandbox) {
          return;
        }
        editor.changeCode(newCode || '');
      }
    );
    const disposeModuleChangeHandler = reaction(
      () => store.editor.currentModule,
      newModule => {
        if (isChangingSandbox) {
          return;
        }
        editor.changeModule(newModule);
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
      disposeDependenciesHandler();
      disposeSandboxChangeHandler();
      disposeModuleChangeHandler();
      disposeCodeHandler();
      disposeToggleDevtools();
    };
  };

  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.preferences;

    const codeEditorWidthOffset = store.editor.previewWindow.x;

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
          {!preferences.settings.zenMode && <Header />}
          {preferences.settings.zenMode ? (
            <FilePath
              modules={sandbox.modules}
              directories={sandbox.directories}
              currentModule={currentModule}
              workspaceHidden={store.workspace.isWorkspaceHidden}
              toggleWorkspace={() => signals.workspace.workspaceToggled()}
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
          <div style={{ position: 'relative', display: 'flex', flex: 1 }}>
            <CodeEditor
              onInitialized={this.onInitialized}
              sandbox={sandbox}
              currentModule={currentModule}
              dependencies={sandbox.npmDependencies.toJS()}
              widthOffset={codeEditorWidthOffset}
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
              onChange={code => signals.editor.codeChanged({ code })}
              onModuleChange={moduleId =>
                signals.editor.moduleSelected({ moduleId })
              }
              onSave={code =>
                signals.editor.codeSaved({
                  code,
                  moduleShortid: currentModule.shortid,
                })
              }
            />
            <Preview />
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
