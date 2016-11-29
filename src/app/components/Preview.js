/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { Module } from '../store/entities/modules/';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 3px;
`;

const StyledFrame = styled.iframe`
  border-width: 0px;
  height: 100%;
  width: 100%;
`;

type Props = {
  modules: Array<Module>;
  module: Module;
  setError: (error: ?{ message: string; line: number }) => void;
}

type State = {
  frameInitialized: boolean;
}

export default class Preview extends React.Component {
  constructor() {
    super();

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
    window.addEventListener('message', (e) => {
      if (e.data === 'Ready!') {
        this.setState({
          frameInitialized: true,
        });
        this.executeCode();
      } else {
        const { type } = e.data;
        if (type === 'error') {
          const { error } = e.data;
          this.props.setError(error);
        } else if (type === 'success') {
          this.props.setError(null);
        }
      }
    });
  }

  executeCode = () => {
    const { modules, module } = this.props;

    requestAnimationFrame(() => {
      document.getElementById('sandbox').contentWindow.postMessage({
        module, modules,
      }, '*');
    });
  }

  props: Props;
  state: State;
  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    return (
      <Container>
        <StyledFrame
          sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms"
          src="http://safe.dev.codesandbox.io/frame.html"
          id="sandbox"
        />
      </Container>
    );
  }
}
