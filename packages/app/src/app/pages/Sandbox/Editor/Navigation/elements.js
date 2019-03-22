import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: ${props => props.topOffset}px;
  bottom: ${props => props.bottomOffset}px;
  left: 0;

  display: flex;
  flex-direction: column;
  width: 3.5rem;
  flex: 0 0 3.5rem;
  height: 100%;
  color: ${props =>
    props.theme['activityBar.inactiveForeground'] ||
    'rgba(255, 255, 255, 0.5)'};

  font-size: 1.4rem;
  align-items: center;

  background-color: ${props =>
    props.theme['activityBar.background'] || 'inherit'};
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease all;
  height: 3.5rem;
  width: 3.5rem;
  font-size: 1.875rem;
  color: ${props =>
    props.theme['activityBar.inactiveForeground'] ||
    'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme['activityBar.foreground'] || 'white'};
  }

  ${props =>
    props.selected &&
    css`
      color: ${props.theme['activityBar.foreground'] || 'white'};
    `};
`;
