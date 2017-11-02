import React from 'react';
import styled from 'styled-components';

import * as templates from 'common/templates';

import setupCanvas from './canvas';

const Container = styled.div`
  transition: 0.8s ease all;
  transition-delay: 1s;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  background-color: ${props => props.color};
`;

export default class Background extends React.PureComponent {
  state = {
    templates: Object.keys(templates)
      .filter(k => k !== 'default' && k !== '__esModule')
      .map(tem => templates[tem]),
    templateIndex: 0,
  };

  startCanvas = (el: HTMLElement) => {
    this.canvas = setupCanvas(el);

    this.props.setCanvas(this.canvas);
  };

  render() {
    const { template, templateIndex } = this.props;

    return (
      <Container color={template.color.clearer(0.97)()}>
        <canvas
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={this.startCanvas}
        />
      </Container>
    );
  }
}
