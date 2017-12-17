import React from 'react';

import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';

export default class Playground extends React.Component {
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
