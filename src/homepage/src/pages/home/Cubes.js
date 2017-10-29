import React from 'react';
import styled from 'styled-components';

import * as templates from 'common/templates';
import Centered from 'app/components/flex/Centered';

import Cube from '../../components/Cube';

const Container = styled.div`
  flex: 3;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledCube = styled(Cube)`
  margin: 200px 0;
  float: right;
`;

const MultipleCubes = styled.div`
  display: flex;
  flex-direction: row;
`;

const SmallCube = styled(Cube)`
  transition: 0.8s ease all;

  margin: 0 30px;
`;

const CircleCube = styled(Cube)`
  position: absolute;
  top: 250px;
  transform: ${({ x, y }) => `translateY(${x}px) translateX(${y}px)`};
`;

const CUBE_AMOUNT = 30;
const RADIUS = 400;
const OTHER_CUBES = Array.from(new Array(CUBE_AMOUNT)).map((_, i) => {
  const row = i % 3;
  const radius = 250 + row * 150;
  const angle = Math.PI * 2 / CUBE_AMOUNT * i;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  return { x, y, delay: row * 500 };
});

export default class Cubes extends React.PureComponent {
  state = {
    templates: Object.keys(templates)
      .filter(k => k !== 'default' && k !== '__esModule')
      .map(tem => templates[tem]),
    templateIndex: 0,
  };

  render() {
    const { template } = this.props;
    return (
      <Container>
        <Centered horizontal>
          <iframe
            src={`https://codesandbox.io/embed/${template.shortid}?codemirror=1`}
            style={{
              height: 500,
              width: 900,
              border: 0,
              borderRadius: 4,
              overflow: 'hidden',
              transform: ' rotateY(-30deg) rotateX(20deg)',
              perspective: 1200,
              boxShadow: '25px 25px 25px rgba(0, 0, 0, 0.4)',
            }}
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
          />
        </Centered>
      </Container>
    );
  }
}
