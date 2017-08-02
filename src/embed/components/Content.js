// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox, Module, ModuleError } from 'common/types';
import fetchBundle from 'app/store/entities/sandboxes/bundler';
import {
  findCurrentModule,
  findMainModule,
} from '../../app/store/entities/sandboxes/modules/selectors';

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
};

type State = {
  bundle: Object,
  isInProjectView: boolean,
  codes: { [id: string]: string },
  errors: Array<ModuleError>,
};

export default class Content extends React.PureComponent {
  state: State = {
    bundle: {
      processing: true,
    },
    inInProjectView: false,
    codes: {},
    errors: [],
  };

  componentDidMount() {
    this.fetchBundle();
    setTimeout(() => this.handleResize());
  }

  fetchBundle = () => {
    fetchBundle(
      { SUCCESS: 'SUCCESS' },
      this.props.sandbox.id,
      this.props.sandbox.npmDependencies,
    )(({ type, result }) => {
      if (type === 'SUCCESS') {
        this.setState({ bundle: { ...result, processing: false } });
      }
    });
  };

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
        '*',
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
        '*',
      );
    } else {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: 500, // pixels
        }),
        '*',
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

  getPreferences = () => {
    return { ...this.preferences, fontSize: this.props.fontSize };
  };

  props: Props;
  state: State;
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
      findMainModule(sandbox.modules),
    );

    if (!mainModule) throw new Error('Cannot find main module');

    return (
      <Container>
        {showEditor &&
          <Split show={showEditor} only={showEditor && !showPreview}>
            <CodeEditor
              code={mainModule.code}
              id={mainModule.id}
              title={mainModule.title}
              modulePath={getModulePath(
                alteredModules,
                sandbox.directories,
                mainModule.id,
              )}
              changeCode={this.setCode}
              preferences={this.getPreferences()}
            />
          </Split>}

        {showPreview &&
          <Split show={showPreview} only={showPreview && !showEditor}>
            <Preview
              sandboxId={sandbox.id}
              isInProjectView={isInProjectView}
              modules={alteredModules}
              directories={sandbox.directories}
              bundle={this.state.bundle}
              externalResources={sandbox.externalResources}
              module={mainModule}
              fetchBundle={this.fetchBundle}
              addError={this.addError}
              clearErrors={this.clearErrors}
              preferences={this.getPreferences()}
              setProjectView={this.props.setProjectView}
              hideNavigation={hideNavigation}
              setFrameHeight={this.handleResize}
              initialPath={this.props.initialPath}
              errors={errors}
            />
          </Split>}
      </Container>
    );
  }
}
