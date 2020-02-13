import fadeIn from '@codesandbox/common/lib/utils/animation/fade-in';
import styled, { css } from 'styled-components';

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

export const Container = styled.div<{ REDESIGNED_SIDEBAR: boolean }>`
  ${({ REDESIGNED_SIDEBAR, theme }) => css`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${theme['sideBar.background'] || theme.background};
    color: ${theme['sideBar.foreground'] || 'inherit'};
    height: 100%;
    width: 100%;
    overflow-y: overlay;
    overflow-x: auto;

    ${REDESIGNED_SIDEBAR &&
      css`
        * {
          box-sizing: border-box;
        }
      `}
  `};
`;

export const ContactContainer = styled.div`
  ${({ theme }) => css`
    padding: 1rem;
    color: ${theme.white ? '#636363' : 'rgba(255, 255, 255, 0.6)'};
    font-size: 1.25rem;
  `};
`;

export const WorkspaceSubtitle = styled.h4`
  ${({ theme }) => css`
    font-size: 0.875rem;
    margin: 0.5rem 0;
    font-weight: 400;
    color: ${theme.light
      ? theme.background3.darken(0.5)
      : theme.background3.lighten(0.5)};
    padding: 0 1rem;
  `};
`;

export const Icon = styled.div`
  ${({ theme }) => css`
    position: relative;
    display: inline-block;
    transition: 0.3s ease color;
    cursor: pointer;
    color: ${theme.light ? '#6C6C6C' : 'rgba(255, 255, 255, 0.5)'};
    padding-left: 0.5rem;

    &:hover {
      color: ${theme.light ? 'black' : 'rgba(255, 255, 255, 1)'};
    }
  `};
`;

export const IconArea = styled.div`
  position: absolute;
  right: 1rem;
  opacity: 0;
  line-height: 1;
  vertical-align: middle;
  ${fadeIn(0)};
`;

export const WorkspaceInputContainer = styled.div<{ errorMessage?: string }>`
  ${({ errorMessage, theme }) => css`
    display: flex;
    overflow: visible;
    font-size: 0.875rem;
    margin: 0.5rem 0.75rem;

    input,
    textarea {
      transition: 0.3s ease background-color, 0.3s ease border-color;
      font-family: inherit;
      margin: 0 0.25rem;
      padding: 0.25rem;
      width: 100%;
      outline: none;
      border-radius: 2px;
      background-color: ${errorMessage
        ? theme.redBackground.clearer(0.5)
        : theme['input.background'] || 'rgba(0, 0, 0, 0.2)'};
      color: ${errorMessage
        ? theme.red
        : theme['input.foreground'] || theme.white};
      border: 1px solid transparent;

      &:focus {
        border-color: ${theme.secondary.clearer(0.5)};
      }
    }

    input::-webkit-input-placeholder {
      color: ${theme.background2.lighten(2.9)};
    }
  `};
`;

export const ItemTitle = styled.div`
  ${({ theme }) => css`
    font-size: 0.875rem;

    padding: 0 1rem;
    margin-bottom: 0.25rem;
    height: 35px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-weight: 700;

    color: ${theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
  `};
`;

export const Description = styled.div`
  ${({ theme }) => css`
    margin: 0.5rem 1rem;
    line-height: 1.4;
    font-size: 0.875rem;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  `};
`;

export const ErrorDescription = styled(Description)`
  ${({ theme }) => css`
    color: ${theme.red};
  `};
`;

export const VersionContainer = styled.div`
  ${({ theme }) => css`
    display: inline-flex;
    align-items: center;
    float: right;
    font-size: 0.6rem;
    height: 28px;
    vertical-align: middle;
    font-weight: 600;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
  `};
`;
