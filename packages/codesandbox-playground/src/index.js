import React from 'react';
import PropTypes from 'prop-types';
import { filePropTypes } from './utils/prop-types';

import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';

export default class Playground extends React.Component {
  static propTypes = {
    ...filePropTypes,
  };
  static defaultProps = {
    entry: 'index.js',
  };

  render() {
    return (
      <div>
        {/* <CodeEditor /> */}
        <Preview />
      </div>
    );
  }
}
