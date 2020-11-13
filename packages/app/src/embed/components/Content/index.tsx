import BasePreview from '@codesandbox/common/lib/components/Preview';
import RunOnClick from '@codesandbox/common/lib/components/RunOnClick';
import {
  findMainModule,
  resolveModule,
} from '@codesandbox/common/lib/sandbox/modules';
import getTemplate from '@codesandbox/common/lib/templates';
import { parseSandboxConfigurations } from '@codesandbox/common/lib/templates/configuration/parse-sandbox-configurations';
import { getPreviewTabs } from '@codesandbox/common/lib/templates/devtools';
import {
  DevToolsTabPosition,
  Module,
  ModuleCorrection,
  ModuleError,
  Sandbox,
  Settings,
} from '@codesandbox/common/lib/types';
import { Editor } from 'app/components/CodeEditor/types'; // eslint-disable-line
import {
  DevToolProps,
  DevTools,
  IViewType,
} from 'app/components/Preview/DevTools';
import { StyledNotSyncedIcon } from 'app/pages/Sandbox/Editor/Content/Tabs/ModuleTab/elements';
import Tab from 'app/pages/Sandbox/Editor/Content/Tabs/Tab';
import {
  StyledCloseIcon,
  TabDir,
  TabTitle,
} from 'app/pages/Sandbox/Editor/Content/Tabs/Tab/elements';
import { clearCorrectionsFromAction } from 'app/utils/corrections';
import { CorrectionClearAction } from 'codesandbox-api/dist/types/actions/correction';
// @flow
import * as React from 'react';

// borrow the menu icon from Header in case header is not shown
import { MenuIcon } from '../legacy/Header/elements';
import SplitPane from '../SplitPane';
import { CodeEditor } from './CodeEditor';
import { Container, MenuInTabs, Tabs } from './elements';

type Props = {
  showEditor: boolean;
  showPreview: boolean;
  previewWindow: string;
  isInProjectView: boolean;
  setProjectView: (
    sandboxId: string | undefined,
    isOpen: boolean,
    cb: () => void
  ) => void;
  sandbox: Sandbox;
  currentModule: Module;
  hideNavigation: boolean;
  autoResize: boolean;
  fontSize?: number;
  initialPath: string;
  setCurrentModule: (moduleId: string) => void;
  useCodeMirror: boolean;
  enableEslint: boolean;
  highlightedLines: number[];
  forceRefresh: boolean;
  expandDevTools: boolean;
  hideDevTools: boolean;
  runOnClick: boolean;
  verticalMode: boolean;
  tabs?: string[];
  isNotSynced: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleLike: () => void;
  editorSize: number;
};

type State = {
  tabs: Array<Module>;
  isInProjectView: boolean;
  dragging: boolean;
  running: boolean;
  currentDevToolPosition: DevToolsTabPosition;
  editorSize: number;
};
// eslint-disable-next-line import/no-default-export
export default class Content extends React.PureComponent<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);

    const tabs = this.getInitTabs(props);

    this.state = {
      running: !props.runOnClick,
      tabs,
      dragging: false,
      isInProjectView: props.isInProjectView,
      currentDevToolPosition: {
        devToolIndex: 0,
        tabPosition: 0,
      },
      editorSize: this.props.editorSize,
    };

    this.errors = [];
    this.corrections = [];
  }

  setPane = (pos: DevToolsTabPosition) => {
    this.setState({ currentDevToolPosition: pos });
  };

  getInitTabs = (props: Props) => {
    let tabs: Array<Module> = [];
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
      tabs = [module, ...props.sandbox.modules.filter(m => m.id !== module.id)];
    } else {
      tabs = [module];
    }

    return tabs;
  };

  renderTabStatus = (hovering, closeTab) => {
    const { isNotSynced } = this.props;

    if (hovering && isNotSynced && this.state.tabs.length === 1) {
      return <StyledNotSyncedIcon show="true" />;
    }
    if (hovering && isNotSynced && this.state.tabs.length > 1) {
      return <StyledCloseIcon onClick={closeTab} show="true" />;
    }
    if (hovering && this.state.tabs.length === 1) {
      return <StyledCloseIcon onClick={closeTab} show={undefined} />;
    }
    if (hovering && this.state.tabs.length > 1) {
      return <StyledCloseIcon onClick={closeTab} show="true" />;
    }
    if (!hovering && isNotSynced) {
      return <StyledNotSyncedIcon show="true" />;
    }
    if (!hovering && !isNotSynced) {
      return <StyledNotSyncedIcon show={undefined} />;
    }
    return <StyledNotSyncedIcon show={undefined} />;
  };

  errors: ModuleError[];
  corrections: ModuleCorrection[];
  editor?: Editor;
  preview?: BasePreview;

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.currentModule !== nextProps.currentModule) {
      if (!this.state.tabs.some(x => x.id === nextProps.currentModule.id)) {
        const module = nextProps.sandbox.modules.find(
          m => m.id === nextProps.currentModule.id
        );
        if (module) {
          this.setState(state => ({
            tabs: [...state.tabs, module],
          }));
        }
      }
      if (this.editor && this.editor.changeModule) {
        this.editor.changeModule(nextProps.currentModule);
      }
    }

    if (this.props.sandbox.id !== nextProps.sandbox.id) {
      this.setState({
        tabs: this.getInitTabs(nextProps),
      });
    }
  }

  componentDidMount() {
    setTimeout(this.handleResize);
  }

  setProjectView = (id: string | undefined, view: boolean) => {
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

  handleAction = (action: any) => {
    switch (action.action) {
      case 'show-error':
        return this.addError(action);
      case 'show-correction':
        return this.addCorrection(action);
      case 'clear-corrections':
        return this.clearCorrections(action);
      case 'editor.open-module':
        return this.setCurrentModuleFromPath(action.path);
      default:
        return null;
    }
  };

  setCurrentModuleFromPath = (path: string) => {
    try {
      const module = resolveModule(
        path,
        this.props.sandbox.modules,
        this.props.sandbox.directories
      );

      this.setCurrentModule(module.id);
    } catch (e) {
      /* Ignore */
    }
  };

  addError = (error: ModuleError) => {
    if (module) {
      this.errors.push(error);

      if (this.editor && this.editor.setErrors) {
        this.editor.setErrors(this.errors);
      }
    }
  };

  addCorrection = (correction: ModuleCorrection) => {
    this.corrections.push(correction);

    if (this.editor && this.editor.setCorrections) {
      this.editor.setCorrections(this.corrections);
    }
  };

  clearCorrections = (action: CorrectionClearAction) => {
    this.corrections = clearCorrectionsFromAction(this.corrections, action);

    if (this.editor && this.editor.setCorrections) {
      this.editor.setCorrections(this.corrections);
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

  // TODO: We should probably create a "default settings factory",
  // cause now forcing invalid settings
  getPreferences = (): Settings =>
    ({
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
      clearConsoleEnabled: false,
      prettierConfig: null,
      zenMode: false,
    } as Settings);

  setCurrentModule = (moduleId: string) => {
    this.props.setCurrentModule(moduleId);
  };

  closeTab = (pos: number, active: boolean) => {
    if (active) {
      const newModule =
        this.state.tabs[pos - 1] ||
        this.state.tabs[pos + 1] ||
        this.state.tabs[0];
      this.props.setCurrentModule(newModule.id);
    }
    this.setState(state => ({ tabs: state.tabs.filter((_, i) => i !== pos) }));
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

  refresh = () => {
    if (this.preview && this.preview.handleRefresh) {
      this.preview.handleRefresh();
    }
  };

  setEditorSize = editorSize => {
    this.setState({
      editorSize,
    });
  };

  openInNewWindow = () => {
    // this is set in app/Preview
    // i don't know why but I ain't complaining
    // @ts-ignore
    if (window.openNewWindow) window.openNewWindow();
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
      expandDevTools,
      hideDevTools,
      verticalMode,
      sidebarOpen,
      toggleSidebar,
      toggleLike,
      editorSize,
      initialPath,
    } = this.props;

    const { isInProjectView } = this.state;

    const mainModule = isInProjectView
      ? findMainModule(sandbox)
      : currentModule;

    if (!mainModule) throw new Error('Cannot find main module');

    const templateDefinition = getTemplate(sandbox.template);
    const parsedConfigurations = parseSandboxConfigurations(sandbox);
    let views = getPreviewTabs(sandbox, parsedConfigurations);

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

    if (hideDevTools) {
      views = [views[0]]; // show preview only
    }

    if (view !== 'browser') {
      // Backwards compatability for sandbox.config.json
      if (view === 'console') {
        views[0].views.unshift({ id: 'codesandbox.console' });
      } else if (view === 'tests') {
        views[0].views.unshift({ id: 'codesandbox.tests' });
      }
    }

    /**
      We can't make assumptions about the default value
      of open because it's loaded from common/templates.

      Example: server templates have devTools open by default

      If the user wants to override the default, they can
      do that by using the explicit flag.
    */
    if (typeof expandDevTools !== 'undefined' && views[1]) {
      views[1].open = expandDevTools;
    }

    const preferences = this.getPreferences();

    const browserConfig: IViewType = {
      id: 'codesandbox.browser',
      title: options =>
        options.port ? `Browser (:${options.port})` : `Browser`,
      Content: ({ hidden, options }: DevToolProps) => (
        <BasePreview
          onInitialized={this.onPreviewInitialized}
          sandbox={sandbox}
          hide={hidden}
          url={options.url ? options.url : undefined}
          currentModule={mainModule}
          settings={preferences}
          initialPath={initialPath}
          isInProjectView={isInProjectView}
          onClearErrors={this.clearErrors}
          onAction={this.handleAction}
          showNavigation={!hideNavigation}
          onToggleProjectView={this.onToggleProjectView}
          onResize={this.handleResize}
          dragging={this.state.dragging}
          showScreenshotOverlay
        />
      ),
      actions: [],
    };

    // TODO: we use verticalMode as a very very bad proxy
    // for identifying mobile mode
    // mobile isn't even vertical anymore!
    // we should really rename it
    return (
      <Container style={{ flexDirection: verticalMode ? 'column' : 'row' }}>
        <SplitPane
          sandbox={sandbox}
          showEditor={showEditor}
          showPreview={showPreview}
          isSmallScreen={verticalMode}
          sidebarOpen={sidebarOpen}
          showNavigationActions={hideNavigation}
          refresh={this.refresh}
          openInNewWindow={this.openInNewWindow}
          toggleLike={toggleLike}
          initialEditorSize={editorSize}
          initialPath={initialPath}
          setEditorSize={this.setEditorSize}
          hideDevTools={hideDevTools}
          setDragging={this.setDragging}
        >
          <>
            <Tabs>
              <MenuInTabs onClick={toggleSidebar}>
                <MenuIcon />
              </MenuInTabs>

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

                const active = module.id === currentModule.id;
                return (
                  <Tab
                    key={module.id}
                    active={active}
                    module={module}
                    onClick={() => this.setCurrentModule(module.id)}
                    tabCount={this.state.tabs.length}
                    position={i}
                    closeTab={this.closeTab}
                    dirName={dirName}
                  >
                    {({ hovering, closeTab }) => (
                      // TODO deduplicate this
                      <>
                        <TabTitle>{module.title}</TabTitle>
                        {dirName && (
                          <TabDir>
                            ../
                            {dirName}
                          </TabDir>
                        )}

                        {this.renderTabStatus(hovering, closeTab)}
                      </>
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
                isModuleSynced={() => true}
                sandbox={sandbox}
                settings={this.getPreferences()}
                readOnly={templateDefinition.isServer}
                onChange={this.setCode}
                onModuleChange={this.setCurrentModule}
                highlightedLines={this.props.highlightedLines}
                width={this.state.editorSize}
              />
            </div>
          </>

          {!this.state.running ? (
            <RunOnClick onClick={() => this.setState({ running: true })} />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {views.map((devView, i) => (
                /* eslint-disable react/no-array-index-key */
                <DevTools
                  key={i}
                  devToolIndex={i}
                  addedViews={{
                    'codesandbox.browser': browserConfig,
                  }}
                  setDragging={this.setDragging}
                  sandboxId={sandbox.id}
                  template={sandbox.template}
                  owned={false}
                  primary={i === 0}
                  hideTabs={i === 0}
                  viewConfig={devView}
                  setPane={this.setPane}
                  currentDevToolIndex={
                    this.state.currentDevToolPosition.devToolIndex
                  }
                  currentTabPosition={
                    this.state.currentDevToolPosition.tabPosition
                  }
                />
              ))}
            </div>
          )}
        </SplitPane>
      </Container>
    );
  }
}
