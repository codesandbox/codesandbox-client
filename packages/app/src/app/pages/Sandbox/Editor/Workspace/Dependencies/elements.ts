import styled, { css } from 'styled-components';

export const ErrorMessage = styled.div`
  ${({ theme }) => css`
    color: ${theme.red};
    padding: 0 1rem 1rem;
    font-size: 0.875rem;
  `};
`;

export const Link = styled.a.attrs({
  rel: 'noopener noreferrer',
  target: '_blank',
})`
  ${({ theme }) => css`
    color: ${theme.templateColor || theme.secondary};
    text-decoration: none;
  `};
`;
