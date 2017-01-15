/* @flow */
import React from 'react';
import styled from 'styled-components';

import { debounce } from 'lodash';

import type { Module } from '../../../../../../store/entities/modules/';
import type { Source } from '../../../../../../store/entities/sources/';
import type { Directory } from '../../../../../../store/entities/directories/index';

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
`;

const StyledFrame = styled.iframe`
  border-width: 0px;
  height: 100%;
  width: 100%;
`;

const LoadingDepText = styled.div`
  position: absolute;
  font-size: 2rem;
  color: black;
  text-align: center;
  vertical-align: middle;
  top: 50%; bottom: 0; right: 0; left: 0;
  margin: auto;
`;

type Props = {
  modules: Array<Module>;
  directories: Array<Directory>;
  bundle: typeof Source.bundle;
  fetchBundle: (id: string) => Object;
  module: Module;
  setError: (id: string, error: ?{ message: string; line: number }) => void;
};

type State = {
  frameInitialized: boolean;
};

export default class Preview extends React.PureComponent {
  constructor() {
    super();

    this.setError = debounce(this.setError, 500);
    this.state = {
      frameInitialized: false,
    };
  }

  fetchBundle = () => {
    const { module, fetchBundle } = this.props;
    if (this.currentBundler) {
      this.currentBundler.cancel();
    }
    this.currentBundler = fetchBundle(module.sourceId);
  };

  currentBundler: {
    cancel: () => void;
  };

  componentDidUpdate(prevProps: Props) {
    if ((prevProps.module.code !== this.props.module.code) && this.state.frameInitialized) {
      this.executeCode();
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  handleMessage = (e: Object) => {
    if (e.data === 'Ready!') {
      this.setState({
        frameInitialized: true,
      });
      this.executeCode();
    } else {
      const { type } = e.data;
      if (type === 'error') {
        const { error } = e.data;
        this.setError(error);
      } else if (type === 'success') {
        this.setError.cancel();
        // To reset the debounce, but still quickly remove errors
        this.props.setError(this.props.module.id, null);
      }
    }
  }

  executeCode = () => {
    const { modules, directories, bundle = {}, module } = this.props;

    if (bundle.manifest == null) {
      if (!bundle.processing && !bundle.error) {
        this.fetchBundle();
      }
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById('sandbox').contentWindow.postMessage({
        module,
        modules,
        directories,
        manifest: bundle.manifest,
        url: bundle.url,
      }, '*');
    });
  }

  setError = (e: ?{ message: string; line: number }) => {
    this.props.setError(this.props.module.id, e);
  }

  props: Props;
  state: State;
  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const { bundle = {} } = this.props;

    const location = document.location;
    if (bundle.processing) {
      return (
        <Container>
          <LoadingDepText>Loading the dependencies...</LoadingDepText>
        </Container>
      );
    }

    return (
      <Container>
        <StyledFrame
          sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms"
          src={`${location.protocol}//sandbox.${location.host}`}
          id="sandbox"
        />
      </Container>
    );
  }
}
