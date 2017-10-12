// @flow

import * as React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import {
  findCurrentModule,
  findMainModule,
  getModulePath,
} from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox, Module, ModuleError } from 'common/types';

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 3rem);
`;

const Split = styled.div`
  position: relative;
  width: ${props => (props.show ? '50%' : '0px')};
  max-width: ${props => (props.only ? '100%' : '50%')};
  min-width: ${props => (props.only ? '100%' : '50%')};
  height: calc(100% + 3rem);
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
};

type State = {
  isInProjectView: boolean,
  codes: { [id: string]: string },
  errors: Array<ModuleError>,
};

export default class Content extends React.PureComponent<Props, State> {
  state = {
    inInProjectView: false,
    codes: {},
    errors: [],
  };

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
    fontSize: this.props.fontSize,
    autoDownloadTypes: true,
    lintEnabled: this.props.enableEslint,
    codeMirror: this.props.useCodeMirror,
  });

  setCurrentModule = (_, moduleId) => {
    this.props.setCurrentModule(moduleId);
  };

  render() {
    const {
      sandbox,
      showEditor,
      showPreview,
      isInProjectView,
      currentModule,
      hideNavigation,
    } = this.props;

    const { errors } = this.state;

    const alteredModules = this.getAlteredModules();

    // $FlowIssue
    const mainModule: Module = findCurrentModule(
      sandbox.modules,
      sandbox.directories,
      currentModule,
      findMainModule(sandbox.modules, sandbox.template)
    );

    if (!mainModule) throw new Error('Cannot find main module');

    // The altered module is the same module, but with updated code (based on)
    // changes by the user. We need to use this to reflect changes
    const alteredMainModule = alteredModules.find(m => m.id === mainModule.id);

    if (!alteredMainModule) throw new Error('Cannot find main module');

    return (
      <Container>
        {showEditor && (
          <Split show={showEditor} only={showEditor && !showPreview}>
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
              canSave={false}
              corrections={[]}
            />
          </Split>
        )}

        {showPreview && (
          <Split show={showPreview} only={showPreview && !showEditor}>
            <Preview
              sandboxId={sandbox.id}
              template={sandbox.template}
              isInProjectView={isInProjectView}
              modules={alteredModules}
              directories={sandbox.directories}
              externalResources={sandbox.externalResources}
              module={mainModule}
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
            />
          </Split>
        )}
      </Container>
    );
  }
}
