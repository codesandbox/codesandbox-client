'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Input_1 = require('../../Input');
const keybindings_1 = require('../../../utils/keybindings');
const SPECIAL_KEYS = ['Meta', 'Control', 'Alt', 'Shift', 'Enter', 'Backspace'];
const IGNORED_KEYS = ['Backspace', 'Escape', 'CapsLock'];
function sortKeys(keys) {
  return keys.sort((a, b) => {
    const isASpecial = SPECIAL_KEYS.indexOf(a) > -1;
    const isBSpecial = SPECIAL_KEYS.indexOf(b) > -1;
    if (isASpecial && isBSpecial) {
      return 0;
    } else if (isASpecial) {
      return -1;
    } else if (isBSpecial) {
      return 1;
    }
    return 0;
  });
}
class KeybindingInput extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      recording: false,
      recordedKeys: [],
    };
    this.handleChange = e => {
      const value = e.target.value;
      this.props.setValue(value);
    };
    this.keypresses = 0;
    this.handleKeyDown = e => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Enter') {
        this.props.setValue(this.state.recordedKeys);
      } else if (e.key === 'Backspace') {
        this.props.setValue(undefined);
      }
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Backspace') {
        this.setState({ recordedKeys: [] });
        e.target.blur();
        return;
      }
      const upperCaseKey = keybindings_1.normalizeKey(e);
      if (
        this.state.recordedKeys.indexOf(upperCaseKey) === -1 &&
        IGNORED_KEYS.indexOf(e.key) === -1
      ) {
        this.keypresses += 1;
        this.setState({
          recordedKeys: sortKeys([...this.state.recordedKeys, upperCaseKey]),
        });
      }
    };
    this.handleKeyUp = e => {
      e.preventDefault();
      e.stopPropagation();
      this.keypresses -= 1;
    };
    this.handleKeyPress = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    this.handleFocus = () => {
      this.setState({
        recording: true,
        recordedKeys: [],
      });
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
      document.addEventListener('keypress', this.handleKeyPress);
    };
    this.handleBlur = () => {
      this.keypresses = 0;
      if (this.state.recording) {
        this.setState({
          recording: false,
        });
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('keypress', this.handleKeyPress);
      }
    };
  }
  render() {
    const { recording, recordedKeys } = this.state;
    const { value, placeholder = 'Enter Keystroke' } = this.props;
    const keys = recording ? recordedKeys : value || [];
    return React.createElement(Input_1.default, {
      style: Object.assign({ width: '6rem' }, this.props.style),
      value: keys.map(keybindings_1.formatKey).join(' + '),
      placeholder: placeholder,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      readOnly: true,
    });
  }
}
exports.default = KeybindingInput;
