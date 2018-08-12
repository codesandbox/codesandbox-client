import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 4rem;
  flex: 0 0 4rem;
  height: 100%;
  color: ${props =>
    props.theme['activityBar.foreground'] || 'rgba(255, 255, 255, 0.6)'};

  font-size: 1.5rem;
  align-items: center;

  background-color: ${props =>
    props.theme['activityBar.background'] || 'inherit'};
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease all;
  height: 64px;
  width: 64px;
  cursor: pointer;

  &:hover {
    color: white;
  }

  ${props =>
    props.selected &&
    css`
      color: white;
      background-color: ${props.theme.templateColor
        ? props.theme.templateColor()
        : props.theme.secondary()};
    `};
`;
