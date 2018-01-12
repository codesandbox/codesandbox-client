import * as React from 'react';
import BasePreview from 'app/components/Preview';
import CodeEditor from 'app/components/CodeEditor';
import Tab from 'app/pages/Sandbox/Editor/Content/Tabs/Tab';

import Fullscreen from 'common/components/flex/Fullscreen';
import Centered from 'common/components/flex/Centered';
import theme from 'common/theme';

import { resolveModule, findMainModule } from 'common/sandbox/modules';
import playSVG from './play.svg';

import { Container, Tabs, Split } from './elements';

export default class Content extends React.PureComponent {
  constructor(props) {
    super(props);

    let tabs = [];

    // Show all tabs if there are not many files
    if (props.sandbox.modules.length <= 5) {
      tabs = [...props.sandbox.modules];
    } else {
      tabs = [props.sandbox.modules.find(m => m.id === props.currentModule.id)];
    }

    this.state = {
      running: !props.runOnClick,
      tabs,
    };

    this.errors = [];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentModule !== nextProps.currentModule) {
      if (!this.state.tabs.some(x => x.id === nextProps.currentModule.id)) {
        this.setState({
          tabs: [
            ...this.state.tabs,
            nextProps.sandbox.modules.find(
              m => m.id === nextProps.currentModule.id
            ),
          ],
        });
      }
      this.editor.changeModule(nextProps.currentModule);
    }
  }

  componentDidMount() {
    setTimeout(this.handleResize);
  }

  setProjectView = (id, view) => {
    this.setState({ isInProjectView: view });
  };

  handleResize = (height = 500) => {
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

  setCode = code => {
    this.props.currentModule.code = code;
    const settings = this.getPreferences();

    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        this.preview.executeCodeImmediately();
      } else {
        this.preview.executeCode();
      }
    }
  };

  handleAction = action => {
    switch (action.action) {
      case 'show-error':
        return this.addError(action);
      default:
        return null;
    }
  };

  addError = error => {
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
        },
      ];

      this.editor.setErrors(this.errors);
    }
  };

  clearErrors = () => {
    this.errors = [];
    if (this.editor) {
      this.editor.setErrors(this.errors);
    }
  };

  preferences = {
    livePreviewEnabled: true,
  };

  getPreferences = () => ({
    ...this.preferences,
    forceRefresh: this.props.forceRefresh,
    instantPreviewEnabled: !this.props.forceRefresh,
    fontSize: this.props.fontSize,
    autoDownloadTypes: true,
    lintEnabled: this.props.enableEslint,
    codeMirror: this.props.useCodeMirror,
    lineHeight: 1.4,
  });

  setCurrentModule = (_, moduleId) => {
    this.props.setCurrentModule(moduleId);
  };

  closeTab = pos => {
    const newModule =
      this.state.tabs[pos - 1] ||
      this.state.tabs[pos + 1] ||
      this.state.tabs[0];
    this.props.setCurrentModule(newModule.id);
    this.setState({ tabs: this.state.tabs.filter((_, i) => i !== pos) });
  };

  onCodeEditorInitialized = editor => {
    this.editor = editor;
    return () => {};
  };

  onToggleProjectView = () => {
    this.props.setProjectView(null, !this.props.isInProjectView, () =>
      this.preview.handleRefresh()
    );
  };

  onPreviewInitialized = preview => {
    this.preview = preview;
    return () => {};
  };
  RunOnClick = () => (
    <Fullscreen
      style={{ backgroundColor: theme.primary(), cursor: 'pointer' }}
      onClick={() => this.setState({ running: true })}
    >
      <Centered horizontal vertical>
        <img width={170} height={170} src={playSVG} alt="Run Sandbox" />
        <div
          style={{
            color: theme.red(),
            fontSize: '2rem',
            fontWeight: 700,
            marginTop: 24,
            textTransform: 'uppercase',
          }}
        >
          Click to run
        </div>
      </Centered>
    </Fullscreen>
  );

  render() {
    const {
      sandbox,
      showEditor,
      showPreview,
      currentModule,
      hideNavigation,
      isInProjectView,
      editorSize,
      expandDevTools,
    } = this.props;

    const mainModule = isInProjectView
      ? findMainModule(sandbox.modules, sandbox.directories, sandbox.entry)
      : currentModule;

    if (!mainModule) throw new Error('Cannot find main module');

    const { RunOnClick } = this;

    return (
      <Container>
        {showEditor && (
          <Split
            show={showEditor}
            only={showEditor && !showPreview}
            size={editorSize}
          >
            <Tabs>
              {this.state.tabs.map((module, i) => {
                const tabsWithSameName = this.state.tabs.filter(
                  m => m.title === module.title
                );
                let dirName = null;

                if (tabsWithSameName.length > 1 && module.directoryShortid) {
                  dirName = sandbox.directories.find(
                    d => d.shortid === module.directoryShortid
                  ).title;
                }

                return (
                  <Tab
                    key={module.id}
                    active={module.id === currentModule.id}
                    module={module}
                    onClick={() => this.setCurrentModule(null, module.id)}
                    tabCount={this.state.tabs.length}
                    position={i}
                    closeTab={this.closeTab}
                    dirName={dirName}
                  />
                );
              })}
            </Tabs>

            <CodeEditor
              onInitialized={this.onCodeEditorInitialized}
              currentModule={currentModule || mainModule}
              sandbox={sandbox}
              settings={this.getPreferences()}
              dependencies={sandbox.npmDependencies}
              canSave={false}
              hideNavigation={hideNavigation}
              onChange={this.setCode}
              onModuleChange={this.setCurrentModule}
            />
          </Split>
        )}

        {showPreview && (
          <Split
            show={showPreview}
            only={showPreview && !showEditor}
            size={100 - editorSize}
          >
            {!this.state.running ? (
              <RunOnClick />
            ) : (
              <BasePreview
                onInitialized={this.onPreviewInitialized}
                sandbox={sandbox}
                currentModule={mainModule}
                settings={this.getPreferences()}
                initialPath={this.props.initialPath}
                isInProjectView={isInProjectView}
                onClearErrors={this.clearErrors}
                onAction={this.handleAction}
                onToggleProjectView={this.onToggleProjectView}
                showDevtools={expandDevTools}
                onResize={this.handleResize}
              />
            )}
          </Split>
        )}
      </Container>
    );
  }
}
