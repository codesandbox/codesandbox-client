/* @flow */
import React from 'react';
import styled from 'styled-components';

import ErrorComponent from './Error';
import type { Module } from '../../store/entities/modules/';


const StyledFrame = styled.iframe`
  border-width: 0px;
  height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  position: relative;
  margin: 1rem;
  padding-bottom: 300px;
`;

type Props = {
  modules: Array<Module>;
  code: string;
  error: ?Error;
  setError: (error: Error) => void;
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
    if (prevProps.code !== this.props.code && this.state.frameInitialized) {
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
    const { modules, code } = this.props;

    document.getElementById('sandbox').contentWindow.postMessage({
      code, modules,
    }, '*');
  }

  props: Props;
  state: State;
  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const { error } = this.props;
    return (
      <div style={{ height: '100vh', position: 'relative', overflow: 'scroll' }}>
        <Container>
          <StyledFrame sandbox="allow-scripts" src="http://localhost:8080" id="sandbox" />
        </Container>
        <ErrorComponent error={error} />
      </div>
    );
  }
}
