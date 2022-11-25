import styled from 'styled-components';
import { CodeContainer } from '../../../../CodeEditor/CodeMirror/elements';

export const IconContainer = styled.div`
  display: inline-flex;
  padding: 0.5rem 0;
  width: 24px;
  align-items: center;
  justify-content: center;
`;

export const CodeMirrorContainer = styled(CodeContainer)`
  display: flex;
  align-items: center;
  background-color: ${props =>
    props.theme['input.background'] || props.theme.background.darken(0.3)};

  > div {
    width: 100%;
  }

  .CodeMirror {
    background: ${props =>
      props.theme['input.background'] || props.theme.background.darken(0.3)};
  }
`;
