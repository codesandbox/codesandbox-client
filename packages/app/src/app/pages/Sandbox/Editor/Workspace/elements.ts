import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${theme['sideBar.background'] || theme.background};
    color: ${theme['sideBar.foreground'] || 'inherit'};
    height: 100%;
    width: 100%;
    overflow-x: auto;

    * {
      box-sizing: border-box;
    }
  `};
`;

// used in embed
export const EntryContainer = styled.div<{
  active?: boolean;
  alternative?: boolean;
  color?: string;
  depth?: number;
  editing?: boolean;
  nameValidationError?: string | null | false;
  noTransition?: boolean;
  rightColors?: string[];
}>`
  ${({
    active = false,
    alternative = false,
    color: colorProp,
    depth,
    editing = false,
    nameValidationError,
    noTransition = false,
    rightColors,
    theme,
  }) => {
    const getSelectedColor = (activeColor: string) => {
      // some have active as full white and should never be
      if (activeColor === '#FFFFFF') {
        return theme.light ? '#6C6C6C' : activeColor;
      }
      return activeColor || theme.white();
    };
    const color =
      colorProp ||
      (alternative
        ? theme.primary
        : theme.templateBackgroundColor ||
          theme.templateColor ||
          theme.secondary);
    return css`
      ${noTransition ? '' : 'transition: 0.3s ease all;'}
      position: relative;
      display: flex;
      font-size: 14px;
      padding: 0.4rem;
      padding-left: ${depth != null
        ? `calc(${depth + 1}rem - 2px)`
        : 'calc(1rem - 2px)'};
      padding-right: 3rem;
      color: ${theme['sideBar.foreground'] ||
      (theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)')};
      text-decoration: none;
      font-weight: 400;
      min-width: 100px;
      border-left: 2px solid transparent;
      cursor: pointer;
      user-select: none;
      &:hover {
        ${!(active || editing) &&
        css`
          background-color: ${theme['list.hoverBackground'] ||
          color.clearer(0.9)()};
          color: ${theme['list.hoverForeground'] ||
          (theme.light ? '#6c6c6c' : theme.background.lighten(5)())};
          border-color: ${color.darken(0.4)()};
        `}
        > div {
          opacity: 1 !important;
        }
      }
      ${active &&
      css`
        color: ${getSelectedColor(
          theme['list.activeSelectionForeground']
        )} !important;
        border-color: ${color()} !important;
        background-color: ${color.lighten(0.1).clearer(0.8)()} !important;
      `};
      ${editing &&
      css`
        color: ${theme.white()};
        background-color: ${color.clearer(0.9)()};
        ${nameValidationError &&
        css`
          border-color: ${theme.red()} !important;
          background-color: ${theme['list.invalidItemForeground'] ||
          theme.redBackground.clearer(0.4)()} !important;
        `};
      `};
      ${rightColors &&
      css`
        border-right: 2px solid ${rightColors[0]};
      `};
    `;
  }};
`;
