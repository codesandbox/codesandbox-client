import * as React from 'react';
import ReactDOM from 'react-dom';

export default class Portal extends React.Component {
  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (typeof window === 'undefined') {
      return (
        <div style={{ position: 'fixed', right: 99999 }}>
          {this.props.children}
        </div>
      );
    }

    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }
    return ReactDOM.createPortal(
      this.props.children,
      this.props.node || this.defaultNode
    );
  }
}
