import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const RedIcon = styled.span<{ height: number; width: number }>`
  ${({ height, theme, width }) => css`
    color: ${theme.red};
    width: ${width}px;
    height: ${height}px;
  `};
`;

export const SVGIcon = styled.span<{
  height: number;
  url: string;
  width: number;
}>`
  ${({ height, url, width }) => css`
    background-image: url(${url});
    background-size: ${width}px;
    background-position: 0;
    background-repeat: no-repeat;
    width: ${width}px;
    height: ${height}px;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    vertical-align: top;
    flex-shrink: 0;
  `};
`;
