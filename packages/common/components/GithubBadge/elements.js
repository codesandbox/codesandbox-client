import styled, { css } from 'styled-components';

export const BorderRadius = styled.div`
  transition: 0.3s ease all;
  border-radius: 4px;
  border: 1px solid #4f5459;
  font-size: 0.75em;
  margin-right: 1rem;

  display: flex;

  ${props =>
    props.hasUrl &&
    css`
      &:hover {
        background-color: #4f5459;
      }
    `};
`;

export const Text = styled.span`
  display: inline-block;

  color: ${props =>
    props.theme.light ? '#636363' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 4px;
  padding: 3px 5px;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const Icon = styled.span`
  display: inline-block;
  padding: 3px 5px;
  background-color: #4f5459;
  border-radius: 2px;
  color: ${props => props.theme.background};
`;

export const StyledA = styled.a`
  text-decoration: none;
`;
