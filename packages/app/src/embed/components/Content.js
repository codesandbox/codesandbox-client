// @flow

import * as React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import Tab from 'app/components/sandbox/CodeEditor/Tabs/Tab';
import {
  findCurrentModule,
  findMainModule,
  getModulePath,
} from 'app/store/entities/sandboxes/modules/selectors';

import Fullscreen from 'common/components/flex/Fullscreen';
import Centered from 'common/components/flex/Centered';
import type { Sandbox, Module, ModuleError } from 'common/types';
import theme from 'common/theme';

import playSVG from './play.svg';

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 2.5rem);
`;

const Tabs = styled.div`
  display: flex;
  height: 2.5rem;
  min-height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  overflow-x: auto;

  -ms-overflow-style: none; // IE 10+
  overflow: -moz-scrollbars-none; // Firefox

  &::-webkit-scrollbar {
    height: 2px; // Safari and Chrome
  }
`;

const Split = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${props => (props.show ? `${props.size}%` : '0px')};
  max-width: ${props => (props.only ? '100%' : `${props.size}%`)};
  min-width: ${props => (props.only ? '100%' : `${props.size}%`)};
  height: 100%;
`;

type Props = {
  sandbox: Sandbox,
  currentModule: ?string,
  showEditor: boolean,
  showPreview: boolean,
  isInProjectView: boolean,
  hideNavigation: boolean,
  autoResize: boolean,
  fontSize: number,
  initialPath: ?string,
  setCurrentModule: (moduleId: string) => void,
  setProjectView: (id: string, isInProjectView: boolean) => any,
  useCodeMirror: boolean,
  enableEslint: boolean,
  isInProjectView: boolean,
  editorSize: number,
  forceRefresh: boolean,
  highlightedLines: Array<string>,
  expandDevTools: boolean,
  runOnClick: boolean,
};

type State = {
  isInProjectView: boolean,
  codes: { [id: string]: string },
  errors: Array<ModuleError>,
  tabs: Array<Module>,
};

export default class Content extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    let tabs = [];

    // Show all tabs if there are not many files
    if (props.sandbox.modules.length <= 5) {
      tabs = [...props.sandbox.modules];
    } else {
      tabs = [props.sandbox.modules.find(m => m.id === props.currentModule)];
    }

    this.state = {
      inInProjectView: false,
      codes: {},
      errors: [],
      running: !props.runOnClick,
      tabs,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.currentModule !== nextProps.currentModule &&
      !this.state.tabs.some(x => x.id === nextProps.currentModule)
    ) {
      this.setState({
        tabs: [
          ...this.state.tabs,
          nextProps.sandbox.modules.find(m => m.id === nextProps.currentModule),
        ],
      });
    }
  }

  componentDidMount() {
    setTimeout(() => this.handleResize());
  }

  setProjectView = (id: string, view: boolean) => {
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

  setCode = (moduleId: string, code: string) => {
    this.setState({
      ...this.state,
      codes: {
        ...this.state.codes,
        [moduleId]: code,
      },
    });
  };

  addError = (moduleId: string, error: ModuleError) => {
    if (!this.state.errors.find(e => e.moduleId === error.moduleId)) {
      this.setState({
        errors: [...this.state.errors, error],
      });
    }
  };

  clearErrors = () => {
    if (this.state.errors.length > 0) {
      this.setState({
        errors: [],
      });
    }
  };

  lastCodes = {};
  lastAlteredModules = [];
  /**
   * This is a bit of a hack, we utilize custom memoization so we don't return
   * a new array of new modules on each render, because map creates a new array
   */
  getAlteredModules = () => {
    const { sandbox } = this.props;
    const { codes } = this.state;
    const codeChanged = this.lastCodes !== codes;

    if (!codeChanged) {
      return this.lastAlteredModules;
    }

    this.lastCodes = codes;

    // $FlowIssue
    const alteredModules = sandbox.modules.map((m: Module) => ({
      ...m,
      code: codes[m.id] || m.code,
    }));

    this.lastAlteredModules = alteredModules;
    return alteredModules;
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

  setCurrentModule = (_: any, moduleId: string) => {
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
      isInProjectView,
      currentModule,
      hideNavigation,
      editorSize,
      highlightedLines,
      expandDevTools,
    } = this.props;

    const { errors } = this.state;

    const alteredModules = this.getAlteredModules();

    // $FlowIssue
    const mainModule: Module = findCurrentModule(
      sandbox.modules,
      sandbox.directories,
      currentModule,
      findMainModule(sandbox.modules, sandbox.directories, sandbox.entry)
    );

    if (!mainModule) throw new Error('Cannot find main module');

    // The altered module is the same module, but with updated code (based on)
    // changes by the user. We need to use this to reflect changes
    const alteredMainModule = alteredModules.find(m => m.id === mainModule.id);

    if (!alteredMainModule) throw new Error('Cannot find main module');

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
                    active={module.id === currentModule}
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
              code={alteredMainModule.code}
              id={alteredMainModule.id}
              title={alteredMainModule.title}
              modulePath={getModulePath(
                alteredModules,
                sandbox.directories,
                alteredMainModule.id
              )}
              changeCode={this.setCode}
              preferences={this.getPreferences()}
              modules={sandbox.modules}
              directories={sandbox.directories}
              sandboxId={sandbox.id}
              setCurrentModule={this.setCurrentModule}
              template={sandbox.template}
              dependencies={sandbox.npmDependencies}
              hideNavigation={hideNavigation}
              canSave={false}
              corrections={[]}
              highlightedLines={highlightedLines}
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
              <Preview
                sandboxId={sandbox.id}
                template={sandbox.template}
                isInProjectView={isInProjectView}
                modules={alteredModules}
                directories={sandbox.directories}
                externalResources={sandbox.externalResources}
                module={alteredMainModule}
                addError={this.addError}
                clearErrors={this.clearErrors}
                preferences={this.getPreferences()}
                setProjectView={this.props.setProjectView}
                hideNavigation={hideNavigation}
                setFrameHeight={this.handleResize}
                initialPath={this.props.initialPath}
                errors={errors}
                corrections={[]}
                dependencies={sandbox.npmDependencies}
                shouldExpandDevTools={expandDevTools}
                entry={sandbox.entry}
              />
            )}
          </Split>
        )}
      </Container>
    );
  }
}
