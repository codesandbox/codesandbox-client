// @flow
import React from 'react';
import CodeMirror from 'codemirror';
import { injectGlobal } from 'styled-components';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';
import { debounce } from 'lodash';

import theme from '../../common/theme';

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

  .cm-s-oceanic .CodeMirror-activeline-background { background: #343D46; }
  .cm-s-oceanic .CodeMirror-matchingbracket { text-decoration: underline; color: white !important; }
`;

type Props = {
  code: string;
  onChange?: (code: string) => void;
};

export default class Editor extends React.Component {
  props: Props;
  constructor() {
    super();
    this.handleChange = debounce(this.handleChange, 10);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.codemirror && nextProps.code !== this.codemirror.getValue()) {
      const prevScrollPosition = this.codemirror.getScrollInfo();
      this.codemirror.setValue(nextProps.code);
      this.codemirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
    }
  }

  getCodeMirror = (el: Element) => {
    const { code } = this.props;
    this.codemirror = new CodeMirror(el, {
      mode: 'jsx',
      theme: 'oceanic',
      tabSize: 2,
      value: code,
      lineNumbers: true,
      styleActiveLine: true,
    });

    this.codemirror.on('change', this.handleChange);
  };

  handleChange = (doc: any, change: any) => {
    if (this.props.onChange && change.origin !== 'setValue') {
       // $FlowIssue
      this.props.onChange(doc.getValue());
    }
  };

  codemirror: typeof CodeMirror;

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }} ref={this.getCodeMirror} />
    );
  }
}
