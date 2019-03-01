'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const KeybindingInput_1 = require('./KeybindingInput');
class PreferenceKeybinding extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.setValue = index => value => {
      const result = [...this.props.value];
      result[index] = value;
      this.props.setValue(result);
    };
  }
  render() {
    const { value } = this.props;
    return React.createElement(
      'div',
      null,
      React.createElement(
        KeybindingInput_1.default,
        Object.assign({}, this.props, {
          placeholder: 'First',
          value: value[0],
          setValue: this.setValue(0),
        })
      ),
      ' - ',
      React.createElement(
        KeybindingInput_1.default,
        Object.assign({}, this.props, {
          placeholder: 'Second',
          value: value.length === 2 && value[1],
          setValue: this.setValue(1),
          disabled: !value[0] || value[0].length === 0,
        })
      )
    );
  }
}
exports.default = PreferenceKeybinding;
