import styled from 'styled-components';

export const Container = styled.div`
  text-align: left;
  color: white;

  .cm-s-oceanic.CodeMirror {
    padding: 0.5rem;
    margin: 1rem 0;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 2px;
    font-size: 15px;
  }
  .cm-s-oceanic div.CodeMirror-selected {
    background: ${props =>
      props.readOnly ? 'inherit' : 'rgba(255, 255, 255, 0.1)'};
  }
  .cm-s-oceanic .CodeMirror-activeline-background {
    background: ${props =>
      props.readOnly ? 'inherit' : 'rgba(255, 255, 255, 0.1)'};
  }
`;
