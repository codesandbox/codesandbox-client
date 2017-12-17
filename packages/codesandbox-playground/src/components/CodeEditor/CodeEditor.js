// @flow
import * as React from 'react';
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

export default class CodeEditor extends React.Component {
  getCodeMirror = el => {
    console.log('oke');
    this.codemirror = new CodeMirror(el, {
      value: 'console.log("mama")',
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
      lint: false,
    });
  };

  render() {
    console.log('hey?');
    return (
      <div
        style={{
          height: '100%',
        }}
        ref={this.getCodeMirror}
      />
    );
  }
}
