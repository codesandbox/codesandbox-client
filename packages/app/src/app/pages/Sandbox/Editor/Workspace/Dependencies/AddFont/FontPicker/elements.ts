import styled, { css } from 'styled-components';
import Color from 'color';

const makeDarker = ({ theme }) =>
  Color(theme['input.background'])
    .darken(theme.light ? 0.1 : 0.3)
    .rgbString();

export const SearchFonts = styled.input`
  border: 1px solid ${props => makeDarker(props)};
  box-sizing: border-box;
  border-radius: 2px;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  color: ${props =>
    props.theme['input.foreground'] ||
    (props.theme.light ? '#636363' : 'white')};

  ::-webkit-input-placeholder {
    color: ${props =>
      props.theme['input.foreground'] ||
      (props.theme.light ? '#636363' : 'white')};
  }
  ::-moz-placeholder {
    color: ${props =>
      props.theme['input.foreground'] ||
      (props.theme.light ? '#636363' : 'white')};
  }
  :-ms-input-placeholder {
    color: ${props =>
      props.theme['input.foreground'] ||
      (props.theme.light ? '#636363' : 'white')};
  }
`;

export const FontFamily = styled.button<{ active?: boolean }>`
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme['sideBar.background']};
  width: 100%;
  padding-left: 0.25rem;
  border: none;
  text-align: left;
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;

export const FontLI = styled.li`
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  padding: 0.5rem;
  text-align: left;
`;

export const List = styled.ul<{ expanded?: boolean }>`
  width: 100%;
  list-style: none;
  border: 1px solid ${props => makeDarker(props)};
  box-sizing: border-box;
  padding: 0.5rem;
  margin: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.24), 0px 4px 4px rgba(0, 0, 0, 0.12);
  max-height: 0;
  overflow: scroll;
  transition: all 200ms ease;
  text-align: left;
  display: none;
  margin-top: 0.5rem;
  background-color: ${props => props.theme['sideBar.background']};
  position: absolute;
  z-index: 10;

  ${props =>
    props.expanded &&
    css`
      max-height: 130px;
      display: block;
    `}
`;

export const SelectedFont = styled.button<{ done?: boolean }>`
  background-color: ${props =>
    props.theme['input.background'] || 'rgba(0, 0, 0, 0.3)'};
  color: ${props =>
    props.theme['input.foreground'] ||
    (props.theme.light ? '#636363' : 'white')};
  border: 1px solid ${props => makeDarker(props)};

  box-shadow: none;
  text-align: left;
  appearance: none;
  width: 100%;
  padding: 0.5rem 0.75rem;
  position: relative;
  box-sizing: border-box;
  outline: none;

  ${props =>
    props.done &&
    css`
      :after {
        content: '';
        background-image: url("${`data:image/svg+xml,%3Csvg width='7' height='4' viewBox='0 0 7 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.50007 4L1.27146e-07 1.35122e-07L7 -4.76837e-07L3.50007 4Z' fill='${
          props.theme.light ? 'black' : 'white'
        }'/%3E%3C/svg%3E%0A`}");
        width: 7px;
        height: 4px;
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
      }
    `}
`;

export const Arrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent
    ${props => props.theme['sideBar.background']} transparent;
  position: absolute;
  margin-top: 2px;
  left: 50%;
  margin-left: -6px;
`;
