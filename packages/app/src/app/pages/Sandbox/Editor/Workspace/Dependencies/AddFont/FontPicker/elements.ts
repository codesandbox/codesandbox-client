import styled, { css } from 'styled-components';

export const SearchFonts = styled.input`
  height: 23px;
  border: 1px solid #040404;
  box-sizing: border-box;
  border-radius: 2px;
  width: 100%;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`;

export const FontFamily = styled.button`
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme['sideBar.background']};
  width: 100%;
  padding-left: 0.25rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;

export const FontLI = styled.li`
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  padding: 0.5rem;
`;

export const List = styled.ul<{ expanded?: boolean }>`
  width: 100%;
  list-style: none;
  border: 1px solid #000000;
  box-sizing: border-box;
  padding: 0.5rem;
  margin: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.24), 0px 4px 4px rgba(0, 0, 0, 0.12);
  max-height: 0;
  overflow: scroll;
  transition: all 200ms ease;

  ${props =>
    props.expanded &&
    css`
      max-height: 130px;
    `}
`;
