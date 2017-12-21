// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/fold/xml-fold'; // Needed to match JSX
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

import './styles.css';

export default class CodeEditor extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    onChangeCode: PropTypes.func,
  };

  static defaultProps = {
    onChangeCode: () => {},
  };

  getCodeMirror = el => {
    this.codemirror = new CodeMirror(el, {
      value: this.props.code,
      theme: 'oceanic',
      keyMap: 'sublime',
      indentUnit: 2,
      autoCloseBrackets: true,
      matchTags: { bothTags: true },
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      lineNumbers: true,
      lineWrapping: false,
      styleActiveLine: true,
      mode: 'javascript',
    });

    this.codemirror.on('change', this.handleChange);
  };

  handleChange = cm => {
    this.props.onChangeCode(cm.getValue());
  };

  render() {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
        ref={this.getCodeMirror}
      />
    );
  }
}
