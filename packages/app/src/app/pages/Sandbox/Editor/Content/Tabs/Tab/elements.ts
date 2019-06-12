import styled, { css } from 'styled-components';
import CloseIcon from 'react-icons/lib/go/x';

export const Container = styled.div`
  ${({
    active,
    dirty,
    isOver,
    theme,
  }: {
    active: boolean;
    dirty: boolean;
    isOver: boolean;
    theme: any;
  }) => css`
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    height: calc(100% - 1px);
    font-size: 0.875rem;
    cursor: pointer;

    border-bottom: 1px solid transparent;

    padding: 0 1rem;
    padding-left: 0.75rem;
    padding-right: 0.125rem;
    color: ${theme[`tab.inactiveForeground`] ||
      (theme.light ? css`rgba(0, 0, 0, 0.5)` : css`rgba(255, 255, 255, 0.5)`)};

    svg {
      font-size: 1rem;
      margin-right: 0.5rem;
    }

    background-color: ${theme[`tab.inactiveBackground`] || css`transparent`};

    ${isOver &&
      css`
        background-color: ${theme.background2.lighten(0.2)};
      `};
    ${active &&
      css`
        background-color: ${theme[`tab.activeBackground`] || theme.background2};
        border-color: ${theme.secondary};
        color: ${theme[`tab.activeForeground`] ||
          theme[`editor.foreground`] ||
          css`white`};
      `};
    ${dirty &&
      css`
        font-style: italic;
      `};
  `}
`;

export const TabTitle = styled.div`
  padding-right: 0.5rem;
  padding-left: 6px;
  white-space: nowrap;
`;

export const TabDir = styled.div`
  color: rgba(255, 255, 255, 0.3);
  padding-right: 0.5rem;
  white-space: nowrap;
`;

export const StyledCloseIcon = styled(CloseIcon)`
  ${({ show, theme }: { show: boolean; theme: any }) => css`
    transition: 0.1s ease opacity;

    float: right;
    opacity: 1;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.9)`
      : css`rgba(255, 255, 255, 0.9)`};
    margin-right: 0;

    ${!show &&
      css`
        pointer-events: none;
        opacity: 0;
      `};
  `}
`;
