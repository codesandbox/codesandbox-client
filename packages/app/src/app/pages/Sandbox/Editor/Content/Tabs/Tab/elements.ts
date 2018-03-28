import styled, { css, component } from 'app/styled-components';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';
import CloseIcon from 'react-icons/lib/go/x';

export const StyledCloseIcon = styled(component<{
  show: boolean
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}>(CloseIcon))`
  transition: 0.1s ease opacity;

  float: right;
  opacity: 1;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0;

  ${props =>
    !props.show &&
    css`
      pointer-events: none;
      opacity: 0;
    `};
`;

export const StyledNotSyncedIcon = StyledCloseIcon.withComponent(NotSyncedIcon);

export const Container = styled(component<{
  isOver: boolean
  active: boolean
  dirty: boolean
  onClick: () => void
  onDoubleClick: (e: React.MouseEvent<HTMLElement>) => void
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void
}>())`
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
  color: rgba(255, 255, 255, 0.5);

  svg {
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  ${props =>
    props.isOver &&
    css`
      background-color: ${props.theme.background2.lighten(0.2)};
    `};
  ${props =>
    props.active &&
    css`
      background-color: ${props.theme.background2};
      border-color: ${props.theme.secondary};
      color: white;
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
