import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { animated } from 'react-spring';

const fadeIn = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 0.5; }
`;

export const Ref = styled.div`
  width: 100%;
  height: 100%;
`;

export const Create = styled.div`
  opacity: 0;
  z-index: 0;
  pointer-events: none;
  position: fixed;
  top: 25vh;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: 0 auto 20vh;
  height: auto;
  width: 950px;
`;

export const DarkBG = styled.div`
  transition: 0.3s ease opacity;

  ${props =>
    !props.closing &&
    css`
      animation: ${fadeIn} 0.3s;
      animation-fill-mode: forwards;
    `};

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  background-color: black;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 1.75rem);
  box-sizing: border-box;
`;

export const Container = styled.div`
  transition: 0.3s ease background-color;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  font-size: 1.125rem;
  border-radius: 4px;
  width: calc(100% - 2rem);
  height: 100%;
  border: 2px solid
    ${props => (props.color || props.theme.secondary).clearer(0.2)};
  background-color: ${props =>
    (props.color || props.theme.secondary).clearer(0.9)};
  border-style: dashed;
  overflow: hidden;
  outline: none;

  cursor: pointer;
  user-select: none;
  text-decoration: none;

  ${props => props.hide && 'opacity: 0'};

  &:first-child {
    border-bottom: 0;
  }

  &:last-child {
    border-bottom: 2px solid
      ${props => (props.color || props.theme.secondary).clearer(0.2)};
    border-style: dashed;
  }

  &:hover,
  &:focus {
    background-color: ${props =>
      (props.color || props.theme.secondary).clearer(0.8)};
  }
`;

export const ContainerLink = Container.withComponent(Link);

export const AnimatedModalContainer = styled(animated.div)`
  ${props =>
    props.forking &&
    css`
      transition: 0.15s ease all;
      position: fixed;
    `};
`;
