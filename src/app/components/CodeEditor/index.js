/* @flow */
import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/selection/active-line';
import { debounce } from 'lodash';
import './oceanic.css';

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
      <div ref={this.getCodeMirror} />
    );
  }
}
