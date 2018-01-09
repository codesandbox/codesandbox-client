import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 4rem;
  height: 100%;
  flex: 0 0 4rem;
  color: rgba(255, 255, 255, 0.6);

  padding-top: 0.5rem;

  font-size: 1.5rem;
  align-items: center;

  border-right-style: inset;
`;

export const IconContainer = styled.div`
  transition: 0.3s ease color;
  padding: 1rem 0;
  cursor: pointer;

  &:hover {
    color: white;
  }

  ${props =>
    props.selected &&
    css`
      color: white;
    `};
`;
