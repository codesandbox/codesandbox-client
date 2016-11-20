/* @flow */
import React from 'react';
import { render } from 'react-dom';
// import Frame from 'react-frame-component';
import styled from 'styled-components';
import createProxy from 'react-proxy';
import deepForceUpdate from 'react-deep-force-update';

import evalModule from '../../utils/eval-module';
import ErrorComponent from './Error';
import type { Module } from '../../store/entities/modules/';


// const StyledFrame = styled(Frame)`
//   border-width: 0px;
//   width: 100%;
// `;

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

export default class Preview extends React.Component {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.code !== this.props.code) this.executeCode();
  }

  componentDidMount() {
    this.executeCode();
  }

  executeCode = () => {
    const { modules } = this.props;
    if (!this.element) return;

    const { code } = this.props;
    try {
      const Element = evalModule(code, modules).default;
      if (this.proxy) {
        this.proxy.update(Element);
        deepForceUpdate(this.rootInstance);
      } else {
        this.proxy = createProxy(Element);
        const Proxy = this.proxy.get();
        this.rootInstance = render(<Proxy />, this.element);
      }
    } catch (e) {
      this.props.setError(e);
    }
  }

  props: Props;
  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    const { error } = this.props;
    return (
      <div style={{ height: '100vh', position: 'relative', overflow: 'scroll' }}>
        <Container>
          <div ref={(el) => { this.element = el; }} />
        </Container>
        <ErrorComponent error={error} />
      </div>
    );
  }
}
