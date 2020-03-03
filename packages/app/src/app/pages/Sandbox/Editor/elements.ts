import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  .Resizer {
    background: ${props => props.theme['sideBar.border'] || 'black'};
    background-clip: padding-box;
  }
`;

export const SkeletonWrapper = styled.div`
  position: absolute;
  transition: opacity 0.5s ease-out;
  opacity: 1;
  background-color: ${props =>
    props.theme.colors?.editor?.background || 'black'};
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  z-index: 10;
`;

export const SkeletonExplorer = styled.div`
  flex: 0 0 272px;
  border-right: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
  background-color: ${props =>
    props.theme.colors?.sideBar.background || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonExplorerTop = styled.div`
  height: 35px;
  border-bottom: 1px solid
    ${props =>
      props.theme.vscodeTheme.colors.editorGroupHeader?.tabsBackground ||
      'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonEditor = styled.div`
  flex: 1;
  border-right: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonEditorTop = styled.div`
  height: 35px;
  border-bottom: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonDevtools = styled.div`
  flex: 1;
`;
export const SkeletonDevtoolsTop = styled.div`
  height: 35px;
`;
export const SkeletonDevtoolsNavigator = styled.div`
  height: 35px;
  border-bottom: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonDevtoolsIframe = styled.div`
  height: 100%;
  background-color: #fff;
`;
