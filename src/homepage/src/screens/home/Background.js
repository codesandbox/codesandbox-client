import React from 'react';
import styled from 'styled-components';

import setupCanvas from './canvas';

const Container = styled.div`
  transition: 0.8s ease all;
  transition-delay: 1s;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
`;

export default class Background extends React.PureComponent {
  startCanvas = (el: HTMLElement) => {
    this.canvas = setupCanvas(el);

    this.props.setCanvas(this.canvas);
  };

  render() {
    const { template } = this.props;

    return (
      <Container style={{ backgroundColor: template.color.clearer(0.97)() }}>
        <canvas
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={this.startCanvas}
        />
      </Container>
    );
  }
}
