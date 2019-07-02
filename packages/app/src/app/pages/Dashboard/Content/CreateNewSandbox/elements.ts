import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { animated } from 'react-spring/renderprops';

const fadeIn = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 0.5; }
`;

export const DarkBG = styled.div<{ closing: boolean }>`
  ${({ closing }) => css`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: black;
    opacity: 0;
    transition: 0.3s ease opacity;
    ${!closing &&
      css`
        animation: ${fadeIn} 0.3s;
        animation-fill-mode: forwards;
      `};
  `}
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 1.75rem);
  box-sizing: border-box;
`;

export const Container = styled.div<{ hide: boolean }>`
  ${({ color, hide, theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 2rem);
    height: 100%;
    border: 2px dashed ${(color || theme.secondary).clearer(0.2)};
    border-radius: 4px;
    background-color: ${(color || theme.secondary).clearer(0.9)};
    color: rgba(255, 255, 255, 1);
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: none;
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    cursor: pointer;
    user-select: none;
    transition: 0.3s ease background-color;
    ${hide && 'opacity: 0'};

    &:first-child {
      border-bottom: 0;
    }

    &:last-child {
      border-bottom: 2px dashed ${(color || theme.secondary).clearer(0.2)};
    }

    &:hover,
    &:focus {
      background-color: ${(color || theme.secondary).clearer(0.8)};
    }
  `}
`;

export const ContainerLink = Container.withComponent(Link);

export const AnimatedModalContainer = styled(animated.div)<{
  forking: boolean;
}>`
  ${({ forking }) =>
    forking &&
    css`
      position: fixed;
      transition: 0.15s ease all;
    `}
`;

export const FullsizeContainer = styled.div`
  position: fixed;
  top: 25vh;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  z-index: 0;
  width: 950px;
  height: auto;
  margin: 0 auto 15vh;
  pointer-events: none;
`;

export const MeasureContainer = styled.div`
  width: 100%;
  height: 100%;
`;
