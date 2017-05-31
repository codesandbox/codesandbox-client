// @flow

import React from 'react';
import styled from 'styled-components';
import Preview from 'app/components/sandbox/Preview';
import CodeEditor from 'app/components/sandbox/CodeEditor';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import type { Sandbox, Module, ModuleError } from 'common/types';
import fetchBundle from 'app/store/entities/sandboxes/bundler';

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

  handleResize = (height: number) => {
    if (this.props.autoResize) {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: Math.min(height, 500), // pixels
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
    const mainModule: Module =
      alteredModules.find((m: Module) => m.shortid === currentModule) ||
      alteredModules.find(
        (m: Module) => m.title === 'index.js' && m.directoryShortid == null,
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
              preferences={this.preferences}
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
              preferences={this.preferences}
              setProjectView={this.props.setProjectView}
              hideNavigation={hideNavigation}
              setFrameHeight={this.handleResize}
              errors={errors}
            />
          </Split>}
      </Container>
    );
  }
}
