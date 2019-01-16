// @flow
import * as React from 'react';
import type { Sandbox, Module, ModuleError } from 'common/types';
import BasePreview from 'app/components/Preview';
import CodeEditor from 'app/components/CodeEditor';
import type { Editor, Settings } from 'app/components/CodeEditor/types';
import Tab from 'app/pages/Sandbox/Editor/Content/Tabs/Tab';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';

import getTemplate from 'common/templates';

import { StyledNotSyncedIcon } from 'app/pages/Sandbox/Editor/Content/Tabs/ModuleTab/elements';
import {
  TabTitle,
  TabDir,
  StyledCloseIcon,
} from 'app/pages/Sandbox/Editor/Content/Tabs/Tab/elements';

import DevTools from 'app/components/Preview/DevTools';

import { resolveModule, findMainModule } from 'common/sandbox/modules';
import RunOnClick from 'common/components/RunOnClick';

import { Container, Tabs, Split } from './elements';

type EmbedError = {
  column: number,
  line: number,
  message: string,
  title: string,
  payload?: Object,
  severity: 'error' | 'warning',
};

type Props = {
  showEditor: boolean,
  showPreview: boolean,
  previewWindow: string,
  isInProjectView: boolean,
  setProjectView: (sandboxId?: ?string, isOpen: boolean, cb: Function) => void,
  sandbox: Sandbox,
  currentModule: Module,
  hideNavigation: boolean,
  autoResize: boolean,
  fontSize?: number,
  initialPath: string,
  setCurrentModule: (moduleId: string) => void,
  useCodeMirror: boolean,
  enableEslint: boolean,
  editorSize: number,
  highlightedLines: Array<number>,
  forceRefresh: boolean,
  expandDevTools: boolean,
  runOnClick: boolean,
  verticalMode: boolean,
};

type State = {
  tabs: Array<Module>,
  isInProjectView: boolean,
  dragging: boolean,
  running: boolean,
};

export default class Content extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    let tabs = [];

    const module = props.sandbox.modules.find(
      m => m.id === props.currentModule.id
    );
    if (props.tabs) {
      tabs = props.tabs
        .map(modulePath => {
          try {
            return resolveModule(
              modulePath,
              props.sandbox.modules,
              props.sandbox.directories
            );
          } catch (e) {
            return undefined;
          }
        })
        .filter(Boolean);
    } else if (props.sandbox.modules.length <= 5 || !module) {
      // Show all tabs if there are not many files
      tabs = [...props.sandbox.modules];
    } else {
      tabs = [module];
    }

    this.state = {
      running: !props.runOnClick,
      tabs,
      dragging: false,
      isInProjectView: props.isInProjectView,
    };

    this.errors = [];
  }

  renderTabStatus = (hovering, closeTab) => {
    const { isNotSynced, tabCount } = this.props;

    if (hovering && isNotSynced && tabCount === 1) {
      return <StyledNotSyncedIcon show={'true'} />;
    }
    if (hovering && isNotSynced && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show={'true'} />;
    }
    if (hovering && tabCount === 1) {
      return <StyledCloseIcon onClick={closeTab} show={undefined} />;
    }
    if (hovering && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show={'true'} />;
    }
    if (!hovering && isNotSynced) {
      return <StyledNotSyncedIcon show={'true'} />;
    }
    if (!hovering && !isNotSynced) {
      return <StyledNotSyncedIcon show={undefined} />;
    }
    return <StyledNotSyncedIcon show={undefined} />;
  };

  errors: Array<ModuleError>;
  editor: ?Editor;
  preview: ?BasePreview;

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.currentModule !== nextProps.currentModule) {
      if (!this.state.tabs.some(x => x.id === nextProps.currentModule.id)) {
        const module = nextProps.sandbox.modules.find(
          m => m.id === nextProps.currentModule.id
        );
        if (module) {
          this.setState({
            tabs: [...this.state.tabs, module],
          });
        }
      }
      if (this.editor && this.editor.changeModule) {
        this.editor.changeModule(nextProps.currentModule);
      }
    }
  }

  componentDidMount() {
    setTimeout(this.handleResize);
  }

  onCodeEditorUnMount = () => {
    this.editor = null;
  };

  setProjectView = (id?: string, view: boolean) => {
    this.setState({ isInProjectView: view });
  };

  handleResize = (height: number = 500) => {
    const extraOffset = (this.props.hideNavigation ? 3 * 16 : 6 * 16) + 16;
    if (this.props.autoResize) {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: Math.max(height + extraOffset, 50), // pixels
        }),
        '*'
      );
    } else if (this.props.showEditor && !this.props.showPreview) {
      // If there is a focus on the editor, make it full height
      const editor = document.getElementsByClassName('CodeMirror-sizer')[0];
      const editorHeight = editor ? editor.getBoundingClientRect().height : 500;

      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: Math.max(editorHeight + extraOffset, 50), // pixels
        }),
        '*'
      );
    } else {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: 500, // pixels
        }),
        '*'
      );
    }
  };

  setCode = (code: string) => {
    this.props.currentModule.code = code;
    const settings = this.getPreferences();

    if (this.preview) {
      if (settings.livePreviewEnabled) {
        if (settings.instantPreviewEnabled) {
          this.preview.executeCodeImmediately();
        } else {
          this.preview.executeCode();
        }
      }
    }
  };

  handleAction = (action: Object) => {
    switch (action.action) {
      case 'show-error':
        return this.addError(action);
      default:
        return null;
    }
  };

  addError = (error: EmbedError & { path: string }) => {
    const module = resolveModule(
      error.path.replace(/^\//, ''),
      this.props.sandbox.modules,
      this.props.sandbox.directories
    );

    if (module) {
      this.errors = [
        ...this.errors,
        {
          moduleId: module.id,
          column: error.column,
          line: error.line,
          message: error.message,
          title: error.title,
          type: 'compile',
          payload: error.payload || {},
          severity: error.severity || 'error',
        },
      ];

      if (this.editor && this.editor.setErrors) {
        this.editor.setErrors(this.errors);
      }
    }
  };

  clearErrors = () => {
    this.errors = [];
    if (this.editor && this.editor.setErrors) {
      this.editor.setErrors(this.errors);
    }
  };

  preferences = {
    livePreviewEnabled: true,
  };

  getPreferences = (): Settings => ({
    ...this.preferences,
    forceRefresh: this.props.forceRefresh,
    instantPreviewEnabled: !this.props.forceRefresh,
    fontSize: this.props.fontSize,
    autoDownloadTypes: true,
    lintEnabled: this.props.enableEslint,
    codeMirror: this.props.useCodeMirror,
    lineHeight: 1.6,
    autoCompleteEnabled: true,
    vimMode: false,
    tabWidth: 2,
    enableLigatures: false,
  });

  setCurrentModule = (moduleId: string) => {
    this.props.setCurrentModule(moduleId);
  };

  closeTab = (pos: number) => {
    const newModule =
      this.state.tabs[pos - 1] ||
      this.state.tabs[pos + 1] ||
      this.state.tabs[0];
    this.props.setCurrentModule(newModule.id);
    this.setState({ tabs: this.state.tabs.filter((_, i) => i !== pos) });
  };

  onCodeEditorInitialized = (editor: Editor) => {
    this.editor = editor;
    return () => {};
  };

  onToggleProjectView = () => {
    this.props.setProjectView(null, !this.props.isInProjectView, () => {
      if (this.preview && this.preview.handleRefresh) {
        this.preview.handleRefresh();
      }
    });
  };

  onPreviewInitialized = (preview: BasePreview) => {
    this.preview = preview;
    return () => {};
  };

  setDragging = (dragging: boolean) => {
    this.setState({ dragging });
  };

  render() {
    const {
      sandbox,
      showEditor,
      showPreview,
      previewWindow,
      currentModule,
      hideNavigation,
      isInProjectView,
      editorSize,
      expandDevTools,
      verticalMode,
    } = this.props;

    const mainModule = isInProjectView
      ? findMainModule(sandbox.modules, sandbox.directories, sandbox.entry)
      : currentModule;

    if (!mainModule) throw new Error('Cannot find main module');

    const templateDefinition = getTemplate(sandbox.template);

    const sandboxConfig = sandbox.modules.find(
      x => x.directoryShortid == null && x.title === 'sandbox.config.json'
    );

    let view = 'browser';
    if (previewWindow) {
      view = previewWindow;
    } else if (sandboxConfig) {
      try {
        view = JSON.parse(sandboxConfig.code || '').view || 'browser';
      } catch (e) {
        /* swallow */
      }
    }

    return (
      <Container style={{ flexDirection: verticalMode ? 'column' : 'row' }}>
        {showEditor && (
          <Split
            show={showEditor}
            only={showEditor && !showPreview}
            size={editorSize}
            verticalMode={verticalMode}
          >
            <Tabs>
              {this.state.tabs.map((module, i) => {
                const tabsWithSameName = this.state.tabs.filter(
                  m => m.title === module.title
                );
                let dirName = null;

                if (tabsWithSameName.length > 1 && module.directoryShortid) {
                  const dir = sandbox.directories.find(
                    d => d.shortid === module.directoryShortid
                  );
                  if (dir) {
                    dirName = dir.title;
                  }
                }

                return (
                  <Tab
                    key={module.id}
                    active={module.id === currentModule.id}
                    module={module}
                    onClick={() => this.setCurrentModule(module.id)}
                    tabCount={this.state.tabs.length}
                    position={i}
                    closeTab={this.closeTab}
                    dirName={dirName}
                  >
                    {({ hovering, closeTab }) => (
                      // TODO deduplicate this
                      <React.Fragment>
                        <EntryIcons type={getType(module.title)} />
                        <TabTitle>{module.title}</TabTitle>
                        {dirName && (
                          <TabDir>
                            ../
                            {dirName}
                          </TabDir>
                        )}

                        {this.renderTabStatus(hovering, closeTab)}
                      </React.Fragment>
                    )}
                  </Tab>
                );
              })}
            </Tabs>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <CodeEditor
                onInitialized={this.onCodeEditorInitialized}
                currentModule={currentModule || mainModule}
                isModuleSynced
                sandbox={sandbox}
                settings={this.getPreferences()}
                canSave={false}
                readOnly={templateDefinition.isServer}
                onChange={this.setCode}
                onModuleChange={this.setCurrentModule}
                onUnMount={this.onCodeEditorUnMount}
                highlightedLines={this.props.highlightedLines}
              />
            </div>
          </Split>
        )}

        {showPreview && (
          <Split
            show={showPreview}
            only={showPreview && !showEditor}
            size={100 - editorSize}
            verticalMode={verticalMode}
          >
            {!this.state.running ? (
              <RunOnClick onClick={() => this.setState({ running: true })} />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <BasePreview
                  onInitialized={this.onPreviewInitialized}
                  sandbox={sandbox}
                  currentModule={mainModule}
                  settings={this.getPreferences()}
                  initialPath={this.props.initialPath}
                  isInProjectView={isInProjectView}
                  onClearErrors={this.clearErrors}
                  onAction={this.handleAction}
                  showNavigation={!hideNavigation}
                  onToggleProjectView={this.onToggleProjectView}
                  showDevtools={expandDevTools}
                  onResize={this.handleResize}
                  dragging={this.state.dragging}
                />
                <DevTools
                  setDragging={this.setDragging}
                  sandboxId={sandbox.id}
                  template={sandbox.template}
                  shouldExpandDevTools={this.props.expandDevTools}
                  view={view}
                  owned={false}
                />
              </div>
            )}
          </Split>
        )}
      </Container>
    );
  }
}
