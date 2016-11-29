// @flow
import React from 'react';
import CodeMirror from 'codemirror';
import styled, { injectGlobal, keyframes } from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/fold/xml-fold'; // Needed to match JSX
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/selection/active-line';

import { debounce } from 'lodash';

import type { Module } from '../store/entities/modules';
import theme from '../../common/theme';

const documentCache = {};

type Props = {
  module: Module;
  onChange: (code: string) => void;
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ErrorMessage = styled.div`
  position: absolute;
  font-family: 'Source Code Pro', monospace;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #400000;
  font-weight: 400;
  padding: 0.5rem;
  color: #F27777;
`;

const handleError = (cm, currentModule, nextModule) => {
  if (currentModule.error || nextModule.error) {
    if (currentModule.error && nextModule.error &&
      currentModule.error.line === nextModule.error.line) {
      return;
    }

    if (currentModule.error) {
      cm.removeLineClass(currentModule.error.line, 'background', 'cm-line-error');
    }

    if (nextModule.error && (
      nextModule.error.moduleId == null || nextModule.error.moduleId === nextModule.id)
      && nextModule.error.line !== 0 && nextModule.error.line <= nextModule.code.split('\n').length
    ) {
      cm.addLineClass(nextModule.error.line, 'background', 'cm-line-error');
    }
  }
};

export default class Editor extends React.PureComponent {
  props: Props;
  constructor() {
    super();
    this.handleChange = debounce(this.handleChange, 10);
  }

  componentWillReceiveProps(nextProps: Props) {
    const cm = this.codemirror;
    const { module: currentModule } = this.props;
    const { module: nextModule } = nextProps;
    if (cm) {
      if (nextModule.id !== currentModule.id) {
        if (!documentCache[nextModule.id]) {
          documentCache[nextModule.id] = new CodeMirror.Doc(nextModule.code, 'jsx');
        }
        documentCache[currentModule.id] = cm.swapDoc(documentCache[nextModule.id]);
      }

      handleError(cm, currentModule, nextModule);
    }
  }

  getCodeMirror = (el: Element) => {
    const { module } = this.props;
    documentCache[module.id] = new CodeMirror.Doc(module.code, 'jsx');

    this.codemirror = new CodeMirror(el, {
      mode: 'jsx',
      theme: 'oceanic',
      keyMap: 'sublime',
      indentUnit: 2,
      autoCloseBrackets: true,
      matchTags: {
        bothTags: true,
      },
      value: documentCache[module.id],
      lineNumbers: true,
      styleActiveLine: true,
      extraKeys: {
        'Cmd-/': (cm) => {
          cm.listSelections().forEach(() => {
            cm.toggleComment({ lineComment: '//' });
          });
        },
      },
    });


    this.codemirror.on('change', this.handleChange);
  };

  handleChange = (cm: any, change: any) => {
    if (this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(cm.getValue());
    }
  };

  codemirror: typeof CodeMirror;

  render() {
    const { module } = this.props;
    return (
      <Container>
        <div ref={this.getCodeMirror} />
        {module.error && (
          <ErrorMessage><b>{module.error.title}</b>: {module.error.message}</ErrorMessage>
        )}
      </Container>
    );
  }
}

const fadeInAnimation = keyframes`
  0%   { background-color: #374140; }
  100% { background-color: #561011; }
`;

injectGlobal`
  .cm-s-oceanic.CodeMirror {
    font-family: 'Source Code Pro', monospace;
    background: ${theme.background2()};
    color: #e0e0e0;
    height: 100%;
    font-size: 14px;
    font-weight: 500;
  }
  .cm-s-oceanic div.CodeMirror-selected { background: #343D46; }
  .cm-s-oceanic .CodeMirror-line::selection, .cm-s-oceanic .CodeMirror-line > span::selection, .cm-s-oceanic .CodeMirror-line > span > span::selection { background: #65737E; }
  .cm-s-oceanic .CodeMirror-line::-moz-selection, .cm-s-oceanic .CodeMirror-line > span::-moz-selection, .cm-s-oceanic .CodeMirror-line > span > span::-moz-selection { background: #65737E; }
  .cm-s-oceanic .CodeMirror-gutters {
    background: ${theme.background2()};
    border-right: 0px;
  }
  .cm-s-oceanic .CodeMirror-guttermarker { color: #ac4142; }
  .cm-s-oceanic .CodeMirror-guttermarker-subtle { color: #505050; }
  .cm-s-oceanic .CodeMirror-linenumber { color: #505050; }
  .cm-s-oceanic .CodeMirror-cursor { border-left: 1px solid #b0b0b0; }

  .cm-s-oceanic span.cm-comment { color: #8f5536; }
  .cm-s-oceanic span.cm-atom { color: #aa759f; }
  .cm-s-oceanic span.cm-number { color: #aa759f; }

  .cm-s-oceanic span.cm-property, .cm-s-oceanic span.cm-attribute { color: #D8DEE9; }
  .cm-s-oceanic span.cm-keyword { color: #C594C5; }
  .cm-s-oceanic span.cm-string { color: #99C794; }

  .cm-s-oceanic span.cm-variable { color: #FAC863; }
  .cm-s-oceanic span.cm-variable-2 { color: #6a9fb5; }
  .cm-s-oceanic span.cm-def { color: #FAC863; }
  .cm-s-oceanic span.cm-bracket { color: #e0e0e0; }
  .cm-s-oceanic span.cm-tag { color: #EC5f67; }
  .cm-s-oceanic span.cm-link { color: #aa759f; }
  .cm-s-oceanic span.cm-error { background: #ac4142; color: #b0b0b0; }

  .cm-s-oceanic .CodeMirror-activeline-background { background: #374140; }
  .cm-s-oceanic .CodeMirror-matchingbracket { text-decoration: underline; color: white !important; }
  .cm-s-oceanic span.CodeMirror-matchingtag { background-color: inherit; }
  .cm-s-oceanic span.cm-tag.CodeMirror-matchingtag { text-decoration: underline; }
  .cm-s-oceanic span.cm-tag.cm-bracket.CodeMirror-matchingtag { text-decoration: none; }

  .cm-s-oceanic div.cm-line-error.CodeMirror-linebackground { animation: ${fadeInAnimation} 0.3s; background-color: #561011; }
`;
