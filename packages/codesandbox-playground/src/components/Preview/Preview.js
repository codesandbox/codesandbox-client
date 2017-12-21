import React from 'react';
import PropTypes from 'prop-types';

export default class Preview extends React.PureComponent {
  static propTypes = {
    files: PropTypes.shape({
      path: PropTypes.shape({
        code: PropTypes.string.isRequired,
      }),
    }).isRequired,
    dependencies: PropTypes.objectOf(PropTypes.string),
    resources: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    dependencies: {},
    resources: [],
  };

  setupFrame = el => {
    // listen(this.handleMessage);
    if (el) {
      this.frame = el;
      this.frame.onload = () => {
        this.sendCode();
      };
    }
  };

  sendCode = () => {
    const modules = Object.keys(this.props.files).map(path => ({
      ...this.props.files[path],
      path,
    }));

    this.frame.contentWindow.postMessage(
      {
        type: 'compile',
        codesandbox: true,
        version: 2,
        modules,
        entry: '/index.js',
        externalResources: this.props.resources,
        dependencies: this.props.dependencies,
      },
      '*'
    );
  };

  handleMessage = (data, source) => {
    // if (data.type === 'initialized') {
    //   this.frame = source;
    // }
  };

  render() {
    return (
      <iframe
        style={{ width: '100%', height: '1000px', border: 'none' }}
        src="https://sandbox.codesandbox.io"
        ref={this.setupFrame}
      />
    );
  }
}
