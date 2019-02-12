import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  max-height: 100%;
  z-index: 20;
`;

export const Header = styled.div`
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

  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

  cursor: ${props => (props.primary ? 'default' : 'row-resize')};
  flex-direction: row;
  padding-right: 1rem;
`;
