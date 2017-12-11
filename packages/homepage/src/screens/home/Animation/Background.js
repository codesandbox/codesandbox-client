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
          backgroundColor:
            this.colors[template.name] || template.color.clearer(0.97)(),
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
