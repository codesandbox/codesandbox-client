'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Select_1 = require('../Select');
class PreferenceInput extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.handleChange = e => {
      const value = e.target.value;
      this.props.setValue(value);
    };
  }
  render() {
    const { value, options, mapName } = this.props;
    return React.createElement(
      Select_1.default,
      { onChange: this.handleChange, value: value },
      options.map(op =>
        React.createElement(
          'option',
          { key: op, value: op },
          mapName ? mapName(op) : op
        )
      )
    );
  }
}
exports.default = PreferenceInput;
