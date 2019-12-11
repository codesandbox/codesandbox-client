import styled, { css } from 'styled-components';

export const BundlerLink = styled.a.attrs({
  target: '_blank',
  rel: 'noreferrer noopener',
})`
  ${({ theme }) => css`
    color: ${theme.templateColor} !important;
  `}
`;
