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
    background: ${props => props.theme['editorGroup.border'] || 'black'};
    border-color: ${props => props.theme['editorGroup.border'] || 'black'};
    background-clip: padding-box;
  }
`;
