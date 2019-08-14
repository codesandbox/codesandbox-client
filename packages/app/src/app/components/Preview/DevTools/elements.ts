import styled, { css } from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 7;
`;

export const Header = styled.div<{ primary: boolean; open: boolean }>`
  position: relative;
  display: flex;
  font-size: 0.75rem;
  flex: 0 0 ${props => (props.primary ? 35 : 28)}px;
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
  padding-right: 1rem;
`;

export const ContentContainer = styled.div`
  position: relative;
  background-color: ${props =>
    props.theme['panel.background'] ||
    props.theme['editor.background'] ||
    props.theme.background4};
  flex: auto;
  display: flex;
  min-height: 0;
  height: 100%;
`;
