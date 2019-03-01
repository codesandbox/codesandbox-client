'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Tooltip_1 = require('../../components/Tooltip');
const PreferenceSwitch_1 = require('./PreferenceSwitch');
const PreferenceDropdown_1 = require('./PreferenceDropdown');
const PreferenceNumber_1 = require('./PreferenceNumber');
const PreferenceText_1 = require('./PreferenceText');
const PreferenceKeybinding_1 = require('./PreferenceKeybinding');
const elements_1 = require('./elements');
class Preference extends React.Component {
  constructor() {
    super(...arguments);
    this.getOptionComponent = () => {
      const props = this.props;
      if (props.type === 'boolean') {
        return React.createElement(
          PreferenceSwitch_1.default,
          Object.assign({}, props, {
            setValue: props.setValue,
            value: props.value,
          })
        );
      }
      if (props.type === 'string') {
        return React.createElement(
          PreferenceText_1.default,
          Object.assign({}, props, {
            setValue: props.setValue,
            value: props.value,
          })
        );
      }
      if (props.type === 'dropdown') {
        return React.createElement(
          PreferenceDropdown_1.default,
          Object.assign({}, props, {
            options: props.options,
            setValue: props.setValue,
            value: props.value,
          })
        );
      }
      if (props.type === 'keybinding') {
        return React.createElement(
          PreferenceKeybinding_1.default,
          Object.assign({}, props, {
            setValue: props.setValue,
            value: props.value,
          })
        );
      }
      return React.createElement(
        PreferenceNumber_1.default,
        Object.assign({}, props, {
          setValue: props.setValue,
          value: props.value,
        })
      );
    };
  }
  render() {
    const { title, style, className, tooltip } = this.props;
    const Title = tooltip
      ? React.createElement(
          Tooltip_1.default,
          { position: 'right', title: tooltip },
          title
        )
      : React.createElement('span', null, title);
    return React.createElement(
      elements_1.Container,
      { style: style, className: className },
      Title,
      React.createElement('div', null, this.getOptionComponent())
    );
  }
}
exports.default = Preference;
