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
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 0, 0, 0) 60%,
    ${({ color }) => color} 100%
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
      <Container color={template.color.clearer(0.85)}>
        {/* <PositionedCube
          color={template.color.clearer(0.2).darken(0.3)()}
          bottom={50}
          left={120}
          size={50}
          speed={250}
        />
        <PositionedCube
          color={template.color.clearer(0.5).darken(0.2)()}
          bottom={170}
          left={700}
          size={65}
          speed={150}
        />
        <PositionedCube
          color={template.color.clearer(0.1).darken(0.1)()}
          top={170}
          left={700}
          size={65}
          speed={150}
        />
        <PositionedCube
          color={template.color.clearer(0.2).lighten(0.2)()}
          bottom={500}
          left={90}
          size={40}
          speed={250}
        /> */}
      </Container>
    );
  }
}
