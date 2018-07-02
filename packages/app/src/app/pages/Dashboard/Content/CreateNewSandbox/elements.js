import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

export const Container = styled.div`
  transition: 0.3s ease background-color;

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
  border-radius: 4px;
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  border: 2px solid ${props => props.theme.secondary.clearer(0.2)};
  background-color: ${props => props.theme.secondary.clearer(0.9)};
  border-style: dashed;
  overflow: hidden;
  outline: none;

  cursor: pointer;
  user-select: none;

  ${props => props.hide && 'opacity: 0'};

  &:hover,
  &:focus {
    background-color: ${props => props.theme.secondary.clearer(0.8)};
  }
`;

export const AnimatedModalContainer = styled(animated.div)`
  ${props =>
    props.forking &&
    css`
      transition: 0.15s ease all;
      position: fixed;
    `};
`;
