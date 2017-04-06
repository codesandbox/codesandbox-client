import React from 'react';
import styled from 'styled-components';
import CodeMirror from 'codemirror';

import { getCodeMirror } from 'app/utils/codemirror';

const Container = styled.div`
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
    background: ${props => props.readOnly ? 'inherit' : 'rgba(255, 255, 255, 0.1)'};
  }
  .cm-s-oceanic .CodeMirror-activeline-background {
    background: ${props => props.readOnly ? 'inherit' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

type Props = {
  name: string,
  onChange: (code: string) => void,
  readOnly: ?boolean,
};

export default class Editor extends React.PureComponent {
  props: Props;

  setUpCodeMirror = el => {
    const { name, readOnly } = this.props;
    const doc = new CodeMirror.Doc(
      `ReactDOM.render(<${name || 'Component'} />, document.body);`,
      'jsx'
    );
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
