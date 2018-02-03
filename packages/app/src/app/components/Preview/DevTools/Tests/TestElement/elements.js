import styled, { css } from 'styled-components';

export const Container = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const Actions = styled.div`
  transition: 0.3s ease opacity;
  opacity: 0;
  font-size: 1.125rem;

  color: white;

  svg {
    margin-left: 0.5rem;
    transition: 0.3s ease color;

    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
`;

export const FileData = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-left: 2px solid transparent;

  border-bottom: 1px solid rgba(0, 0, 0, 0.3);

  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);

    ${Actions} {
      opacity: 1;
    }
  }

  ${props =>
    props.selected &&
    css`
      border-left-color: ${props.theme.secondary.clearer};
    `};
`;

export const Path = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

export const FileName = styled.span`
  color: rgba(255, 255, 255, 0.8);

  flex: 1;
`;
