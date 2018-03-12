import styled, { keyframes, component } from 'app/styled-components';

const rotateAnimation = keyframes`
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
`;

export const Cube = styled(component<{
  size: number
}>())`
  position: absolute;
  width: ${props => props.size + 1}px;
  height: ${props => props.size + 1}px;

  * {
    position: absolute;
    width: ${props => props.size + 1}px;
    height: ${props => props.size + 1}px;
  }
`;

export const Sides = styled(component<{
  noAnimation: boolean
  size: number
}>())`
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

export const Side = styled(component<{
  rotate: string
  size: number
}>())`
  transform-origin: 50% 50%;
  transform: ${({ rotate }) => rotate} translateZ(${({ size }) => size / 2}px);
`;
