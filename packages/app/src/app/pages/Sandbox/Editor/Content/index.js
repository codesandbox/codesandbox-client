// @flow
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import getTemplateDefinition from 'common/templates';
import type { ModuleError } from 'common/types';

import CodeEditor from 'app/components/CodeEditor';
import type { Editor, Settings } from 'app/components/CodeEditor/types';
import DevTools from 'app/components/Preview/DevTools';
import FilePath from 'app/components/CodeEditor/FilePath';
import Preview from './Preview';

import Tabs from './Tabs';

import { FullSize } from './elements';

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
    tabWidth: store.preferences.settings.tabSize || 2,
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
  interval: number;
  disposeEditorChange: Function;
  el: ?HTMLElement;
  devtools: DevTools;

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
  }

  componentWillUnmount() {
    this.disposeEditorChange();
    window.removeEventListener('resize', this.getBounds);
    clearInterval(this.interval);
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
    const disposeModuleHandler = reaction(
      () => [store.editor.currentModule, store.editor.currentModule.code],
      ([newModule]) => {
        if (isChangingSandbox) {
          return;
        }
        const editorModule = editor.currentModule;

        const changeModule = editor.changeModule;
        if (newModule !== editorModule && changeModule) {
          const errors = store.editor.errors.map(e => e);
          const corrections = store.editor.corrections.map(e => e);
          changeModule(newModule, errors, corrections);
        } else if (editor.changeCode) {
          editor.changeCode(newModule.code || '');
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

  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.preferences;
    const { x, y, width, content } = store.editor.previewWindow;

    const windowVisible = !!content;

    const windowRightSize = -x + width + 16;

    const isVerticalMode = this.state.width
      ? this.state.width / 4 > this.state.width - windowRightSize
      : false;

    let editorWidth = isVerticalMode
      ? '100%'
      : `calc(100% - ${windowRightSize}px)`;
    let editorHeight = isVerticalMode ? `${y + 16}px` : '100%';

    if (!windowVisible) {
      editorWidth = '100%';
      editorHeight = '100%';
    }

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
              marginTop: preferences.settings.zenMode ? 0 : '2.5rem',
            }}
          >
            <CodeEditor
              onInitialized={this.onInitialized}
              sandbox={sandbox}
              currentModule={currentModule}
              width={editorWidth}
              height={editorHeight}
              settings={settings(store)}
              onNpmDependencyAdded={name => {
                if (sandbox.owned) {
                  signals.editor.addNpmDependency({ name, isDev: true });
                }
              }}
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
              tsconfig={
                store.editor.parsedConfigurations.typescript &&
                store.editor.parsedConfigurations.typescript.parsed
              }
            />
            <Preview width={this.state.width} height={this.state.height} />
          </div>

          <DevTools
            ref={component => {
              if (component) {
                this.devtools = component;
              }
            }}
            setDragging={() => this.props.signals.editor.resizingStarted()}
            sandboxId={sandbox.id}
            shouldExpandDevTools={store.preferences.showDevtools}
            zenMode={preferences.settings.zenMode}
            setDevToolsOpen={open =>
              this.props.signals.preferences.setDevtoolsOpen({ open })
            }
          />
        </FullSize>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(EditorPreview));
