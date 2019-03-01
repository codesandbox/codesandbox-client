'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const elements_1 = require('./elements');
class PreferenceInput extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.handleChange = e => {
      const value = e.target.value;
      if (!Number.isNaN(+value)) {
        this.props.setValue(+value);
      }
    };
  }
  render() {
    const { value, style, step } = this.props;
    return React.createElement(elements_1.StyledInput, {
      step: step,
      style: Object.assign({ width: '3rem' }, style),
      type: 'number',
      value: value,
      onChange: this.handleChange,
    });
  }
}
exports.default = PreferenceInput;
