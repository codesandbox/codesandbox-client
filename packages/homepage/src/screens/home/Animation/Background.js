import React from 'react';
import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';

import setupCanvas from './canvas';

const delay = fadeIn(0);

const Container = styled.div`
  transition: 0.8s ease background-color;
  transition-delay: 1s;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
  ${delay};
`;

export default class Background extends React.PureComponent {
  startCanvas = (el: HTMLElement) => {
    this.canvas = setupCanvas(el);

    this.props.setCanvas(this.canvas);
  };

  // Use solid colors for perf
  colors = {
    'create-react-app': '#1E2428',
    '@dojo/cli-create-app': '#211D1C',
    'vue-cli': '#1D2525',
    'preact-cli': '#202328',
    svelte: '#202022',
  };

  componentWillUnmount() {
    if (this.canvas) {
      this.canvas.destroy();
    }

    this.canvas = null;
  }

  render() {
    const { template } = this.props;

    return (
      <Container
        style={{
          background: `linear-gradient(rgba(228, 3, 3, 0.05), rgba(255, 140, 0, 0.05), rgba(255, 237, 0, 0.05), rgba(0, 128, 38, 0.05), rgba(0, 77, 255, 0.05), rgba(117, 7, 135, 0.05))`,
        }}
      >
        <canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          ref={this.startCanvas}
        />
      </Container>
    );
  }
}
