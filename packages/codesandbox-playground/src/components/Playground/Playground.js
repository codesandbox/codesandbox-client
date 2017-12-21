import React from 'react';
import { filePropTypes } from '../../utils/prop-types';

import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import OpenInCodeSandbox from '../OpenInCodeSandbox';

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
    const entryCode = this.state.files[this.props.entry].code;
    const updatedProps = {
      ...this.props,
      files: this.state.files,
    };

    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '100%',
            backgroundColor: '#1C2022',
            color: 'white',
          }}
        >
          <OpenInCodeSandbox {...updatedProps} />
        </div>
        <div style={{ display: 'flex' }}>
          <CodeEditor code={entryCode} onChangeCode={this.handleChange} />
          <Preview {...updatedProps} />
        </div>
      </div>
    );
  }
}
