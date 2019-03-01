'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const react_dom_1 = require('react-dom');
class Portal extends React.Component {
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
    return react_dom_1.default.createPortal(
      this.props.children,
      this.props.node || this.defaultNode
    );
  }
}
exports.default = Portal;
