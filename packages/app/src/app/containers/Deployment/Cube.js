import React from 'react';
import styled, { keyframes } from 'styled-components';

const Cube = styled.div`
  position: absolute;
  width: ${props => props.size + 1}px;
  height: ${props => props.size + 1}px;

  * {
    position: absolute;
    width: ${props => props.size + 1}px;
    height: ${props => props.size + 1}px;
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
`;

const Sides = styled.div`
  ${({ noAnimation }) =>
    !noAnimation && `animation: ${rotateAnimation} 1s linear infinite;`};
  transform-style: preserve-3d;
  transform: rotateX(-37.5deg) rotateY(45deg);

  * {
    box-sizing: border-box;
    background-color: rgba(242, 119, 119, 0.5);
    border: ${({ size }) => size / 10}px solid white;
  }
`;

const Side = styled.div`
  transform-origin: 50% 50%;
  transform: ${({ rotate }) => rotate} translateZ(${({ size }) => size / 2}px);
`;

type Props = {
  size: number,
  className: string,
  noAnimation: ?boolean,
};

export default ({ size = 150, noAnimation, className }: Props) => (
  <Cube className={className} size={size}>
    <Sides noAnimation={noAnimation} size={size}>
      <Side rotate="rotateX(90deg)" size={size} />
      <Side rotate="rotateX(-90deg)" size={size} />
      <Side rotate="rotateY(0deg)" size={size} />
      <Side rotate="rotateY(-180deg)" size={size} />
      <Side rotate="rotateY(-90deg)" size={size} />
      <Side rotate="rotateY(90deg)" size={size} />
    </Sides>
  </Cube>
);
