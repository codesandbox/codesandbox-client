/* @flow */
import React from 'react';
import styled from 'styled-components';

import { debounce } from 'lodash';

import type { Module } from '../../../../store/entities/modules/';
import type { Directory } from '../../../../store/entities/directories/index';

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

type Props = {
  modules: Array<Module>;
  directories: Array<Directory>;
  npmDependencies: Object;
  module: Module;
  sourceId: string;
  setError: (error: ?{ message: string; line: number }) => void;
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

  componentDidUpdate(prevProps: Props) {
    if (prevProps.module.code !== this.props.module.code && this.state.frameInitialized) {
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
        this.props.setError(null); // To reset the debounce, but still quickly remove errors
      }
    }
  }

  executeCode = () => {
    const { modules, sourceId, directories, module } = this.props;

    requestAnimationFrame(() => {
      document.getElementById('sandbox').contentWindow.postMessage({
        module,
        modules,
        directories,
        sourceId,
      }, '*');
    });
  }

  setError = (e: ?{ message: string; line: number }) => {
    this.props.setError(e);
  }

  props: Props;
  state: State;
  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const location = document.location;
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
