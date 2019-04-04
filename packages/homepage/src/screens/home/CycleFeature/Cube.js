import React from 'react';
import styled from 'styled-components';

const Cube = styled.div`
  width: ${props => props.size + 1}px;
  height: ${props => props.size + 1}px;

  * {
    position: absolute;
    width: ${props => props.size + 1}px;
    height: ${props => props.size + 1}px;
  }
`;

const Sides = styled.div`
  transform: rotateY(48deg) rotateX(-20deg) rotateZ(-20deg);
  transform-style: preserve-3d;
  perspective: 10200;

  * {
    box-sizing: border-box;
    background-color: ${({ color }) => color.clearer(0.2)};
    border: ${({ size }) => size / 70}px solid rgba(255, 255, 255, 0.4);
  }
`.withComponent(({ color, size, ...rest }) => <div {...rest} />);

const Side = styled.div`
  transform-origin: 50% 50%;
  transform: ${({ rotate }) => rotate} translateZ(${({ size }) => size / 2}px);
`;

type Props = {
  size: number,
  className: string,
  speed: number,
  color: string,
  offset: number,
};

export default class GlowCube extends React.Component<Props> {
  render() {
    const {
      size = 150,
      color = 'rgba(242,119,119,0.5)',
      speed = 1,
      offset = 0,
      className,
      ref,
      id,
    } = this.props;
    return (
      <Cube id={id} ref={ref} className={className} size={size}>
        <Sides color={color} offset={offset} speed={speed} size={size}>
          <Side
            style={{ boxShadow: `0px 0px 100px ${color.clearer(0.3)()}` }}
            rotate="rotateX(90deg)"
            size={size}
            id={`${id}-side`}
          />
          <Side
            style={{ boxShadow: `0px 0px 150px ${color.clearer(0.3)()}` }}
            rotate="rotateX(-90deg)"
            size={size}
            id={`${id}-side`}
          />
          <Side
            style={{ boxShadow: `0px 0px 150px ${color.clearer(0.3)()}` }}
            rotate="rotateY(0deg)"
            size={size}
            id={`${id}-side`}
          />
          <Side
            style={{ boxShadow: `0px 0px 150px ${color.clearer(0.3)()}` }}
            rotate="rotateY(-180deg)"
            size={size}
            id={`${id}-side`}
          />
          <Side
            style={{ boxShadow: `0px 0px 150px ${color.clearer(0.3)()}` }}
            rotate="rotateY(-90deg)"
            size={size}
            id={`${id}-side`}
          />
          <Side
            style={{ boxShadow: `0px 0px 150px ${color.clearer(0.3)()}` }}
            rotate="rotateY(90deg)"
            size={size}
            id={`${id}-side`}
          />
        </Sides>
      </Cube>
    );
  }
}
