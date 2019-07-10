import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100%;
`;

export const Tabs = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const Tab = styled.div<{ active: boolean; isOver: boolean }>`
  ${({ active, isOver, theme }) => css`
    position: relative;
    transition: 0.2s ease color;
    display: flex;
    align-items: center;
    padding: 0 1.75rem 0 1.25rem;
    height: 100%;
    font-weight: 500;

    cursor: pointer;

    color: ${theme['tab.inactiveForeground'] ||
      theme['panelTitle.inactiveForeground'] ||
      (theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)')};

    ${active
      ? css`
          background-color: ${theme['tab.activeBackground'] ||
            theme['editor.background'] ||
            'transparent'};
          color: ${theme['tab.activeForeground'] ||
            (theme.light ? '#000000' : '#FFFFFF')};
        `
      : css`
          &:hover {
            color: ${theme['tab.activeForeground'] ||
              (theme.light ? '#000000' : '#FFFFFF')};
          }
        `};

    ${isOver &&
      css`
        background-color: ${theme['editorGroup.dropBackground'] ||
          'rgba(0, 0, 0, 0.3)'};
      `};
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
