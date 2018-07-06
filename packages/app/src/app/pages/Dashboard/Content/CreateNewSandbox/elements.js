import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { animated } from 'react-spring';

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
