import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  max-height: 100%;
  z-index: 7;
`;

export const Header = styled.div<{ primary: boolean; open: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  height: ${props => (props.primary ? 35 : 28)}px;
  min-height: ${props => (props.primary ? 35 : 28)}px;
  background-color: ${props =>
    props.theme['editorGroupHeader.tabsBackground'] ||
    props.theme['editor.background'] ||
    props.theme.background4};

  ${props =>
    !props.primary &&
    css`
      border-top: 1px solid
        ${props.theme['panel.border'] || props.theme.background2};
    `};
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

  cursor: ${props =>
    props.primary ? 'default' : props.open ? 'row-resize' : 'n-resize'};
  flex-direction: row;
  padding-right: 1rem;
`;

export const ContentContainer = styled.div`
  background-color: ${props =>
    props.theme['panel.background'] ||
    props.theme['editor.background'] ||
    props.theme.background4};
  position: relative;
  overflow: auto;

  width: 100%;
  height: 100%;
`;
