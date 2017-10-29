import React from 'react';
import styled, { keyframes } from 'styled-components';

const Cube = styled.div`
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
    transform: rotateY(45deg) rotateX(-37.5deg);
  }
  100% {
    transform: rotateY(405deg) rotateX(322.5deg);
  }
`;

const Sides = styled.div`
  transition: 0.8s ease all;
  ${({ noAnimation, speed }) =>
    !noAnimation && `animation: ${rotateAnimation} ${speed}s linear infinite;`};
  transform-style: preserve-3d;
  transform: rotateX(-37.5deg) rotateY(45deg);

  * {
    box-sizing: border-box;
    background-color: ${({ color }) => color};
    border: ${({ size }) => size / 40}px solid rgba(255, 255, 255, 0.7);
  }
`;

const Side = styled.div`
  transition: 0.8s ease all;
  transform-origin: 50% 50%;
  transform: ${({ rotate }) => rotate} translateZ(${({ size }) => size / 2}px);
  box-shadow: 0px 0px 300px ${({ color }) => color};
`;

type Props = {
  size: number,
  className: string,
  noAnimation: ?boolean,
  speed: number,
  color: string,
};

export default ({
  size = 150,
  color = 'rgba(242,119,119,0.5)',
  speed = 1,
  noAnimation,
  className,
}: Props) => (
  <Cube className={className} size={size}>
    <Sides color={color} speed={speed} noAnimation={noAnimation} size={size}>
      <Side color={color} rotate="rotateX(90deg)" size={size} />
      <Side color={color} rotate="rotateX(-90deg)" size={size} />
      <Side color={color} rotate="rotateY(0deg)" size={size} />
      <Side color={color} rotate="rotateY(-180deg)" size={size} />
      <Side color={color} rotate="rotateY(-90deg)" size={size} />
      <Side color={color} rotate="rotateY(90deg)" size={size} />
    </Sides>
  </Cube>
);
