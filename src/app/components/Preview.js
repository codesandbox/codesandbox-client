/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { Module } from '../store/entities/modules/';

const Container = styled.div`
  overflow: scroll;
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
      }
    });
  }

  executeCode = () => {
    const { modules, module } = this.props;

    document.getElementById('sandbox').contentWindow.postMessage({
      module, modules,
    }, '*');
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
          src="/frame.html"
          id="sandbox"
        />
      </Container>
    );
  }
}
