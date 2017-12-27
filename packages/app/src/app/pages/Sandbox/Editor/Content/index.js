import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { observe, reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import getTemplateDefinition from 'common/templates';
import SplitPane from 'react-split-pane';

import CodeEditor from 'app/components/CodeEditor';
import FilePath from 'app/components/CodeEditor/FilePath';
import Preview from './Preview';

import Tabs from './Tabs';
import Header from './Header';

import { FullSize } from './elements';

class EditorPreview extends React.Component {
  componentDidMount() {
    this.props.signals.editor.contentMounted();
  }
  getDefaultSize = () => {
    const preferences = this.props.preferences;
    if (preferences.showEditor && !preferences.showPreview) return '0%';
    if (!preferences.showEditor && preferences.showPreview) return '100%';

    return '50%';
  };
  onInitialized = editor => {
    const store = this.props.store;
    let isChangingSandbox = false;

    const disposeSandboxChangeHandler = observe(
      store.editor,
      'currentSandbox',
      change => {
        isChangingSandbox = true;
        editor
          .changeSandbox(
            change.newValue,
            store.editor.currentModule,
            change.newValue.npmDependencies.toJS()
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
      () => store.editor.preferences.settings,
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

    return () => {
      disposeErrorsHandler();
      disposeCorrectionsHandler();
      disposeModulesHandler();
      disposePreferencesHandler();
      disposeDependenciesHandler();
      disposeSandboxChangeHandler();
      disposeModuleChangeHandler();
      disposeCodeHandler();
    };
  };
  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.editor.preferences;

    const EditorPane = (
      <FullSize>
        {preferences.settings.zenMode ? (
          <FilePath
            modules={sandbox.modules}
            directories={sandbox.directories}
            currentModule={currentModule}
            workspaceHidden={store.editor.workspace.isWorkspaceHidden}
            toggleWorkspace={() => signals.editor.workspace.workspaceToggled()}
            exitZenMode={
              () => {} /* this.props.signals.editor.preferences.settingChanged({ zenMode }) */
            }
          />
        ) : (
          <Tabs />
        )}
        <CodeEditor
          onInitialized={this.onInitialized}
          sandbox={sandbox}
          currentModule={currentModule}
          dependencies={sandbox.npmDependencies.toJS()}
          settings={preferences.settings}
          onNpmDependencyAdded={name =>
            signals.editor.workspace.onNpmDependencyAdded({ name })
          }
          onChange={code => signals.editor.codeChanged({ code })}
          onModuleChange={moduleId =>
            signals.editor.moduleSelected({ moduleId })
          }
          onSave={code => signals.editor.codeSaved({ code })}
        />
      </FullSize>
    );

    const PreviewPane = (
      <FullSize>
        <Preview />
      </FullSize>
    );

    return (
      <ThemeProvider
        theme={{
          templateColor: getTemplateDefinition(sandbox.template).color,
        }}
      >
        <FullSize>
          <Prompt
            when={notSynced}
            message={() =>
              'You have not saved this sandbox, are you sure you want to navigate away?'
            }
          />
          {!preferences.settings.zenMode && <Header />}
          <SplitPane
            onDragStarted={() => this.props.signals.editor.resizingStarted()}
            onDragFinished={() => this.props.signals.editor.resizingStopped()}
            split="vertical"
            defaultSize="50%"
            minSize={360}
            style={{ position: 'static' }}
            resizerStyle={{
              visibility:
                (!preferences.showPreview && preferences.showEditor) ||
                (preferences.showPreview && !preferences.showEditor)
                  ? 'hidden'
                  : 'visible',
            }}
            pane1Style={{
              display: preferences.showEditor ? 'block' : 'none',
              minWidth:
                !preferences.showPreview && preferences.showEditor
                  ? '100%'
                  : 'inherit',
            }}
            pane2Style={{
              display: preferences.showPreview ? 'block' : 'none',
              minWidth:
                preferences.showPreview && !preferences.showEditor
                  ? '100%'
                  : 'inherit',
              height: '100%',
            }}
          >
            {preferences.showEditor && EditorPane}
            {PreviewPane}
          </SplitPane>
        </FullSize>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(EditorPreview));
