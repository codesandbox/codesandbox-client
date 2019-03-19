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
  position: relative;
  transition: 0.2s ease color;
  display: flex;
  align-items: center;
  padding: 0 1.25rem;

  padding-right: 1.75rem;
  height: 100%;
  font-weight: 500;

  cursor: pointer;

  color: ${props =>
    props.theme['tab.inactiveForeground'] ||
    props.theme['panelTitle.inactiveForeground'] ||
    (props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)')};

  ${props =>
    props.active
      ? css`
          background-color: ${props =>
            props.theme['tab.activeBackground'] ||
            props.theme['editor.background'] ||
            'transparent'};
          color: ${() =>
            props.theme['tab.activeForeground'] ||
            (props.theme.light
              ? 'rgba(0, 0, 0, 1)'
              : 'rgba(255, 255, 255, 1)')};
        `
      : css`
          &:hover {
            color: ${() =>
              props.theme['tab.activeForeground'] ||
              (props.theme.light
                ? 'rgba(0, 0, 0, 1)'
                : 'rgba(255, 255, 255, 1)')};
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
