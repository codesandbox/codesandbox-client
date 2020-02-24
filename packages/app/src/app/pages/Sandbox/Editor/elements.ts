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
  transition: opacity 1s ease-out;
  opacity: 1;
  background-color: ${props => props.theme['editor.background'] || 'black'};
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  z-index: 10;
`;

export const SkeletonExplorer = styled.div`
  flex: 0 0 272px;
  border-right: 1px solid ${props => props.theme['sideBar.border'] || 'black'};
`;
export const SkeletonExplorerTop = styled.div`
  height: 35px;
  border-bottom: 1px solid ${props => props.theme['sideBar.border'] || 'black'};
`;
export const SkeletonEditor = styled.div`
  flex: 1;
  border-right: 1px solid ${props => props.theme['sideBar.border'] || 'black'};
`;
export const SkeletonEditorTop = styled.div`
  height: 35px;
  border-bottom: 1px solid ${props => props.theme['sideBar.border'] || 'black'};
`;
export const SkeletonDevtools = styled.div`
  flex: 1;
`;
export const SkeletonDevtoolsTop = styled.div`
  height: 35px;
`;
export const SkeletonDevtoolsNavigator = styled.div`
  height: 35px;
  border-bottom: 1px solid ${props => props.theme['sideBar.border'] || 'black'};
`;
export const SkeletonDevtoolsIframe = styled.div`
  height: 100%;
  background-color: #fff;
`;
