import Color from 'color';
import styled, { css } from 'styled-components';

const svg = ({ theme }) =>
  `data:image/svg+xml,%3Csvg width='7' height='4' viewBox='0 0 7 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.50007 4L1.27146e-07 1.35122e-07L7 -4.76837e-07L3.50007 4Z' fill='${
    theme.light ? 'black' : 'white'
  }'/%3E%3C/svg%3E%0A`;

const makeDarker = ({ theme }) =>
  Color(theme['input.background'])
    .darken(theme.light ? 0.1 : 0.3)
    .rgbString();

const makeLighter = ({ theme }) =>
  Color(theme['sideBar.background'])
    .lighten(0.3)
    .rgbString();

export const SearchFonts = styled.input`
  ${({ theme }) => css`
    border: 1px solid ${makeDarker({ theme })};
    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    color: ${theme['input.foreground'] || (theme.light ? '#636363' : 'white')};

    ::-webkit-input-placeholder,
    ::-moz-placeholder,
    :-ms-input-placeholder {
      color: ${theme['input.foreground'] ||
        (theme.light ? '#636363' : 'white')};
    }
  `};
`;

export const FontFamily = styled.button<{ active?: boolean }>`
  ${({ theme }) => css`
    margin: 0;
    background-color: ${makeLighter({ theme })};
    width: 100%;
    padding: 0 0 0 0.25rem;
    border: none;
    text-align: left;
    color: ${theme['sideBar.foreground'] || 'inherit'};
    cursor: pointer;

    &:focus {
      border-color: ${theme.secondary.clearer(0.6)};
    }
  `};
`;

export const FontLI = styled.li`
  ${({ theme }) => css`
    color: ${theme['sideBar.foreground'] || 'inherit'};
    padding: 0.5rem;
    text-align: left;
    cursor: pointer;
  `};
`;

export const List = styled.ul`
  ${({ theme }) => css`
    font-size: 13px;
    list-style: none;
    border: 1px solid ${makeDarker({ theme })};
    box-sizing: border-box;
    padding: 0.5rem;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24), 0 4px 4px rgba(0, 0, 0, 0.12);
    overflow: scroll;
    transition: all 200ms ease;
    text-align: left;
    margin: 0.5rem 0 0;
    background-color: ${makeLighter({ theme })};
    width: 240px;
    z-index: 10;
    max-height: 130px;
    display: block;
  `};
`;

export const SelectedFont = styled.button`
  ${({ theme }) => css`
background-color: ${theme['input.background'] || 'rgba(0, 0, 0, 0.3)'};
  color: ${theme['input.foreground'] || (theme.light ? '#636363' : 'white')};
  border: 1px solid ${makeDarker({ theme })};

  box-shadow: none;
  text-align: left;
  appearance: none;
  width: 100%;
  padding: 0.5rem 0.75rem;
  position: relative;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;

  :after {
      content: '';
      background-image: url("${svg({ theme })}");
      width: 7px;
      height: 4px;
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
    }
`};æ
`;

export const Arrow = styled.div`
  ${({ theme }) => css`
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent ${theme['sideBar.background']}
      transparent;
    position: absolute;
    margin-top: 2px;
    left: 50%;
    margin-left: -6px;
  `};
`;
