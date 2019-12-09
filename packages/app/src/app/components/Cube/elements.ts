import styled, { css, keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
`;

export const Container = styled.div<{ size: number }>`
  ${({ size }) => css`
    position: absolute;
    width: ${size + 1}px;
    height: ${size + 1}px;

    * {
      position: absolute;
      width: ${size + 1}px;
      height: ${size + 1}px;
    }
  `}
`;

export const Sides = styled.div<{ size: number }>`
  ${({ size }) => css`
    animation: ${rotateAnimation} 1s linear infinite;
    transform-style: preserve-3d;
    transform: rotateX(-37.5deg) rotateY(45deg);

    * {
      box-sizing: border-box;
      background-color: rgba(242, 119, 119, 0.5);
      border: ${size / 10}px solid white;
    }
  `}
`;

export const Side = styled.div<{ rotate: string; size: number }>`
  ${({ rotate, size }) => css`
    transform-origin: 50% 50%;
    transform: ${rotate} translateZ(${size / 2}px);
  `}
`;
