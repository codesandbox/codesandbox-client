import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 4rem;
  flex: 0 0 4rem;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);

  font-size: 1.5rem;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  transition: 0.3s ease all;
  padding: 1rem 0;
  width: 100%;
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
