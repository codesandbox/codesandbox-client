// UNUSED FOR NOW, WILL CONVERT OR REUSE

import React from 'react';
import CodeMirror from 'codemirror';

import { getCodeMirror } from 'app/utils/codemirror';

import { Container } from './elements';

export default class Editor extends React.PureComponent {
  setUpCodeMirror = el => {
    const { code, readOnly } = this.props;
    const doc = new CodeMirror.Doc(code, 'jsx');
    this.codemirror = getCodeMirror(el, doc);
    this.codemirror.setOption('lineNumbers', false);
    this.codemirror.setOption('readOnly', readOnly);

    this.codemirror.on('change', this.handleChange);
  };

  handleChange = (cm: any, change: any) => {
    if (change.origin !== 'setValue' && this.props.onChange) {
      this.props.onChange(cm.getValue());
    }
  };

  render() {
    const { readOnly } = this.props;
    return (
      <Container readOnly={readOnly}>
        <div ref={this.setUpCodeMirror} />
      </Container>
    );
  }
}
