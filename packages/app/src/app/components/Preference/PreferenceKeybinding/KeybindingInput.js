import React from 'react';

import Input from 'app/components/Input';

import { normalizeKey, formatKey } from 'app/store/preferences/keybindings';

type Props = {
  value: Array<string>,
  setValue: (Array<string>) => any,
  placeholder: string,
  style: ?Object,
};

const SPECIAL_KEYS = ['Meta', 'Control', 'Alt', 'Shift', 'Enter', 'Backspace'];
const IGNORED_KEYS = ['Backspace', 'Escape', 'CapsLock'];

function sortKeys(keys: Array<string>) {
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

export default class KeybindingInput extends React.Component {
  props: Props;
  state = {
    recording: false,

    recordedKeys: [],
  };

  handleChange = e => {
    const value = e.target.value;

    this.props.setValue(value);
  };

  keypresses = 0;
  handleKeyDown = e => {
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

    const upperCaseKey = normalizeKey(e);

    if (
      this.state.recordedKeys.indexOf(upperCaseKey) === -1 &&
      IGNORED_KEYS.indexOf(e.key === -1)
    ) {
      this.keypresses += 1;

      this.setState({
        recordedKeys: sortKeys([...this.state.recordedKeys, upperCaseKey]),
      });
    }
  };

  handleKeyUp = e => {
    e.preventDefault();
    e.stopPropagation();
    this.keypresses -= 1;
  };

  handleKeyPress = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleFocus = () => {
    this.setState({
      recording: true,
      recordedKeys: [],
    });
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('keypress', this.handleKeyPress);
  };

  handleBlur = () => {
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

  render() {
    const { recording, recordedKeys } = this.state;
    const { value, placeholder = 'Enter Keystroke' } = this.props;

    const keys = recording ? recordedKeys : value || [];

    return (
      <Input
        style={{ width: '6rem', ...this.props.style }}
        value={keys.map(formatKey).join(' + ')}
        placeholder={placeholder}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        readOnly
      />
    );
  }
}
