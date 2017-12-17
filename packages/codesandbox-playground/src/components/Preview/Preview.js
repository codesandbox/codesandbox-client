import React from 'react';
import { listen, dispatch } from 'codesandbox-api';

export default class Preview extends React.PureComponent {
  setupFrame = el => {
    listen(this.handleMessage);
  };

  sendCode = () => {
    const module = {
      code: 'console.log(require("react")); console.log(require("react-dom"))',
      path: 'index.js',
    };
    this.frame.postMessage(
      {
        type: 'compile',
        codesandbox: true,
        modules: [module],
        path: 'index.js',
        externalResources: [],
        dependencies: { react: '15.5.4', 'react-dom': '15.5.4' },
      },
      '*'
    );
  };

  handleMessage = (data, source) => {
    if (data.type === 'initialized') {
      this.frame = source;
      this.sendCode();
    }
  };

  render() {
    return (
      <iframe
        style={{ width: '100%', height: '100%' }}
        src="http://localhost:3001"
        ref={this.setupFrame}
      />
    );
  }
}
