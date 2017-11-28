// Multi-line input

import React from 'react';
import styled from 'styled-components';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import theme from 'common/theme';

import { IconContainer } from './styles';

import MonacoEditor from 'app/components/sandbox/CodeEditor/monaco/MonacoReactComponent';

const Container = styled.div`
  position: relative;
  height: 2rem;
  min-height: 2rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};

  display: flex;
  align-items: center;
`;

type Props = {
  evaluateConsole: (command: string) => void,
};

const InputWrapper = styled.div`
  position: relative;
  height: 1.5rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};
  /* border: none; */
  /* outline: none; */
  color: rgba(255, 255, 255, 0.8);
  font-family: Menlo, monospace;
  font-size: 13px;
`;

const monacoOptions = {
  wordWrap: 'on',
  overviewRulerLanes: 0,
  glyphMargin: false,
  lineNumbers: 'off',
  folding: false,
  selectOnLineNumbers: false,
  selectionHighlight: false,
  scrollbar: {
    horizontal: 'hidden',
  },
  lineDecorationsWidth: 0,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none',
  // fixedOverflowWidgets: true, //?
  // acceptSuggestionOnEnter: 'smart', //?
  minimap: {
    enabled: false,
  },

  // codesandbox configs (copied form editor)
  // ariaLabel: title, // ConsoleInput?
  // formatOnPaste: true, // check what others do
  // lineHeight: (preferences.lineHeight || 1.15) * preferences.fontSize,
};

// {
//       selectOnLineNumbers: true,
//       fontSize: preferences.fontSize,
//       // Disable this because of a current issue in Windows:
//       // https://github.com/Microsoft/monaco-editor/issues/392
//       // fontFamily: fontFamilies(
//       //   preferences.fontFamily,
//       //   'Source Code Pro',
//       //   'monospace',
//       // ),
//       minimap: {
//         enabled: false,
//       },
//       ariaLabel: title,
//       formatOnPaste: true,
//       lineHeight: (preferences.lineHeight || 1.15) * preferences.fontSize,
//     };

// vscode
// {
//   wordWrap: 'on',
//   overviewRulerLanes: 0,
//   glyphMargin: false,
//   lineNumbers: 'off',
//   folding: false,
//   selectOnLineNumbers: false,
//   selectionHighlight: false,
//   scrollbar: {
//     horizontal: 'hidden'
//   },
//   lineDecorationsWidth: 0,
//   scrollBeyondLastLine: false,
//   renderLineHighlight: 'none',
//   fixedOverflowWidgets: true,
//   acceptSuggestionOnEnter: 'smart',
//   minimap: { // no minimaps
//     enabled: false
//   }
// };

function noop() {
  return Promise.resolve();
}

export default class ConsoleInput extends React.PureComponent<Props> {
  state = {
    command: '',
    commandHistory: [],
    commandCursor: -1,
  };

  render() {
    return (
      <Container>
        <IconContainer style={{ color: theme.secondary() }}>
          <ChevronRight />
        </IconContainer>
        <InputWrapper>
          <MonacoEditor
            width="100%"
            height="100%"
            theme="CodeSandbox"
            options={monacoOptions}
            // editorDidMount={this.configureEditor}
            // editorWillMount={this.editorWillMount}
            openReference={noop}
          />
        </InputWrapper>
      </Container>
    );
    // return <div>hey</div>;
  }
}
