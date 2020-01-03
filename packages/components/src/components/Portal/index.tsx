import React from 'react';
import ReactDOM from 'react-dom';

export interface Props {
  node?: HTMLDivElement;
}

export default class Portal extends React.Component<Props> {
  defaultNode: HTMLDivElement;

  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
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
