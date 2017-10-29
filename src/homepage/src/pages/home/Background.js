import React from 'react';
import styled from 'styled-components';

import * as templates from 'common/templates';

import Cube from '../../components/Cube';

const Container = styled.div`
  transition: 0.8s ease all;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  background-image: linear-gradient(
    -45deg,
    ${({ color }) => color} 0%,
    rgba(0, 0, 0, 0) 70%
  );
`;

const PositionedCube = styled(Cube)`
  position: absolute;

  top: ${props => props.top}px;
  bottom: ${props => props.bottom}px;
  left: ${props => props.left}px;
  right: ${props => props.right}px;
`;

export default class Background extends React.PureComponent {
  state = {
    templates: Object.keys(templates)
      .filter(k => k !== 'default' && k !== '__esModule')
      .map(tem => templates[tem]),
    templateIndex: 0,
  };

  render() {
    const { template, templateIndex } = this.props;

    return (
      <Container color={template.color.clearer(0.95)}>
        <PositionedCube
          color={this.state.templates[
            (templateIndex + 3) % this.state.templates.length
          ].color.clearer(0.2)}
          bottom={50}
          left={120}
          size={20}
          speed={250}
        />
        <PositionedCube
          color={this.state.templates[
            (templateIndex + 1) % this.state.templates.length
          ].color.clearer(0.2)}
          bottom={170}
          left={700}
          size={25}
          speed={150}
        />
        <PositionedCube
          color={this.state.templates[
            (templateIndex + 2) % this.state.templates.length
          ].color.clearer(0.2)}
          bottom={500}
          left={90}
          size={30}
          speed={250}
        />
      </Container>
    );
  }
}
