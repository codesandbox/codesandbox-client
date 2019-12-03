import styled, { css } from 'styled-components';

export const H2 = styled.h2`
  ${({ theme }) => css`
    padding: 0;
    margin: 0;
    margin-bottom: 0.5rem;
    color: ${theme.homepage.white};
    font-family: ${theme.homepage.appleFont};
    font-size: 3rem;
    font-weight: 500;
    line-height: 57px;

    ${theme.breakpoints.md} {
      font-size: 1.8rem;
      line-height: 1.2;
    }
  `}
`;

export const H3 = styled.h3`
  ${({ theme }) => css`
    margin: 0;
    color: ${theme.homepage.white};
    font-size: 2rem;
    font-weight: bold;
    line-height: 39px;
  `}
`;

export const H5 = styled.h5`
  ${({ theme }) => css`
    margin: 0;
    color: ${theme.homepage.white};
    font-family: ${theme.homepage.appleFont};
    font-size: 1.4375rem;
    font-weight: 500;
    line-height: 27px;
  `}
`;

export const P = styled.p<{
  small?: boolean;
  big?: boolean;
  muted?: boolean;
  centered?: boolean;
}>`
  ${({
    small = false,
    big = false,
    muted = false,
    centered = false,
    theme,
  }) => css`
    margin: 0;
    margin-bottom: 1rem;
    color: ${muted ? theme.homepage.muted : theme.homepage.white};
    font-size: ${small ? css`0.875rem` : big ? css`1.4375rem` : css`1.125rem`};
    font-weight: normal;
    line-height: 1.3;

    ${centered &&
      css`
        text-align: center;
      `}
  `}
`;
