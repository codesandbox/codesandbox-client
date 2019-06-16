import styled, { css } from 'styled-components';

export const Icon = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  ${({ theme }) => css`
    display: inline-block;
    margin-right: 0.5em;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.4)`
      : css`rgba(255, 255, 255, 0.4)`};
    font-size: 1.125em;

    &:hover {
      color: ${theme.light
        ? css`rgba(0, 0, 0, 0.6)`
        : css`rgba(255, 255, 255, 0.6)`};
    }
  `}
`;
