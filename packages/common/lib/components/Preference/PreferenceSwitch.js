'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Switch_1 = require('../Switch');
class PreferenceSwitch extends React.Component {
  constructor() {
    super(...arguments);
    this.handleClick = () => {
      this.props.setValue(!this.props.value);
    };
  }
  render() {
    const { value } = this.props;
    return React.createElement(Switch_1.default, {
      onClick: this.handleClick,
      small: true,
      style: { width: '3rem' },
      offMode: true,
      secondary: true,
      right: value,
    });
  }
}
exports.default = PreferenceSwitch;
