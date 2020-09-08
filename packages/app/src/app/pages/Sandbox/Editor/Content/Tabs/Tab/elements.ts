import styled, { css } from 'styled-components';
import CloseIcon from 'react-icons/lib/go/x';

export const Container = styled.div<{
  isOver?: boolean;
  active?: boolean;
  dirty?: boolean;
}>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 100%;
  font-size: 0.875rem;
  cursor: pointer;

  border-bottom: 1px solid ${props => props.theme['tab.border']};

  padding: 0 1rem;
  padding-left: 0.75rem;
  padding-right: 0.125rem;
  color: ${props =>
    props.theme['tab.inactiveForeground'] ||
    (props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)')};

  svg {
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  background-color: ${props =>
    props.theme['tab.inactiveBackground'] || 'transparent'};

  ${props =>
    props.isOver &&
    css`
      background-color: ${props.theme.background2.lighten(0.2)};
    `};
  ${props =>
    props.active &&
    css`
      background-color: ${props.theme['tab.activeBackground'] ||
        props.theme.background2};
      border-color: ${props.theme['tab.activeBorder']};
      color: ${props.theme['tab.activeForeground'] ||
        props.theme['editor.foreground'] ||
        'white'};
    `};
  ${props =>
    props.dirty &&
    css`
      font-style: italic;
    `};
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

export const StyledCloseIcon = styled(CloseIcon)<{ show?: boolean | string }>`
  transition: 0.1s ease opacity;
  width: 0.75em;

  float: right;
  opacity: 1;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  margin-right: 0;

  ${props =>
    !props.show &&
    css`
      pointer-events: none;
      opacity: 0;
    `};
`;
