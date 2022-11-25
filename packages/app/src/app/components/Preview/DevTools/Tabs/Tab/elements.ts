import styled, { css } from 'styled-components';

export const Tab = styled.div<{ active: boolean; isOver: boolean }>`
  position: relative;
  transition: 0.2s ease color;
  display: flex;
  align-items: center;
  padding: 0 1.25rem;
  width: max-content;

  padding-right: 1.75rem;
  height: 100%;
  font-weight: 500;

  cursor: pointer;

  color: ${({ theme }) =>
    theme['tab.inactiveForeground'] ||
    theme['panelTitle.inactiveForeground'] ||
    (theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)')};

  ${props =>
    props.active
      ? css`
          background-color: ${props.theme['tab.activeBackground'] ||
          props.theme['editor.background'] ||
          'transparent'};
          color: ${props.theme['tab.activeForeground'] ||
          (props.theme.light ? '#000000' : '#FFFFFF')};
        `
      : css`
          &:hover {
            color: ${props.theme['tab.activeForeground'] ||
            (props.theme.light ? '#000000' : '#FFFFFF')};
          }
        `};

  ${props =>
    props.isOver &&
    css`
      background-color: ${props.theme['editorGroup.dropBackground'] ||
      'rgba(0, 0, 0, 0.3)'};
    `};
`;

export const CloseTab = styled.button`
  transition: 0.3s ease color;
  display: flex;
  position: absolute;
  right: 0.5rem;
  margin-top: 0.5px;
  border: 0;
  outline: 0;
  color: rgba(255, 255, 255, 0.4);
  padding: 0;
  background-color: transparent;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;
