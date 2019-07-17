import styled, { css } from 'styled-components';
import CloseIcon from 'react-icons/lib/go/x';

export const Container = styled.div<{
  active: boolean;
  dirty: boolean;
  isOver: boolean;
}>`
  ${({ active, dirty, isOver, theme }) => css`
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 1px);
    padding: 0 1rem;
    padding-left: 0.75rem;
    padding-right: 0.125rem;
    border-bottom: 1px solid transparent;
    background-color: ${theme[`tab.inactiveBackground`] || css`transparent`};
    color: ${theme[`tab.inactiveForeground`] ||
      (theme.light ? css`rgba(0, 0, 0, 0.5)` : css`rgba(255, 255, 255, 0.5)`)};
    font-size: 0.875rem;
    line-height: 1;
    cursor: pointer;

    svg {
      font-size: 1rem;
      margin-right: 0.5rem;
    }

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
  padding-left: 6px;
  padding-right: 0.5rem;
  white-space: nowrap;
`;

export const TabDir = styled.div`
  padding-right: 0.5rem;
  color: rgba(255, 255, 255, 0.3);
  white-space: nowrap;
`;

export const StyledCloseIcon = styled(CloseIcon)<{ show?: boolean }>`
  ${({ show = false, theme }) => css`
    float: right;
    margin-right: 0;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.9)`
      : css`rgba(255, 255, 255, 0.9)`};
    opacity: 1;
    transition: 0.1s ease opacity;

    ${!show &&
      css`
        pointer-events: none;
        opacity: 0;
      `};
  `}
`;
