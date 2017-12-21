import React from 'react';
import { filePropTypes } from '../../utils/prop-types';

import CodeEditor from '../CodeEditor';
import Preview from '../Preview';

export default class Playground extends React.Component {
  static propTypes = {
    ...filePropTypes,
  };
  static defaultProps = {
    entry: '/index.js',
  };

  state = {
    files: this.props.files,
  };

  handleChange = (code: string) => {
    const newFiles = {
      ...this.state.files,
      [this.props.entry]: {
        ...[this.state.files[this.props.entry]],
        code,
      },
    };

    this.setState({
      files: newFiles,
    });
  };

  render() {
    const code = this.state.files[this.props.entry].code;

    return (
      <div>
        <div
          style={{
            height: '3rem',
            width: '100%',
            backgroundColor: '#1C2022',
            color: 'white',
          }}
        >
          CodeSandbox
        </div>
        <div style={{ display: 'flex' }}>
          <CodeEditor code={code} onChangeCode={this.handleChange} />
          <Preview {...this.props} files={this.state.files} />
        </div>
      </div>
    );
  }
}
