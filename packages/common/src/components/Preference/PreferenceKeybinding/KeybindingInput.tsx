import React from 'react';
import { Input } from '@codesandbox/components';
import { normalizeKey, formatKey } from '../../../utils/keybindings';

const SPECIAL_KEYS = ['Meta', 'Control', 'Alt', 'Shift', 'Enter', 'Backspace'];
const IGNORED_KEYS = ['Backspace', 'Escape', 'CapsLock'];

function sortKeys(keys) {
  return keys.sort((a, b) => {
    const isASpecial = SPECIAL_KEYS.indexOf(a) > -1;
    const isBSpecial = SPECIAL_KEYS.indexOf(b) > -1;

    if (isASpecial && isBSpecial) {
      return 0;
    }
    if (isASpecial) {
      return -1;
    }
    if (isBSpecial) {
      return 1;
    }

    return 0;
  });
}

export type Props = {
  placeholder: string;
  value: string[];
  setValue: (val: string[]) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
};

export type State = {
  recordedKeys: string[];
  recording: boolean;
};

export default class KeybindingInput extends React.Component<Props, State> {
  state: State = {
    recording: false,
    recordedKeys: [],
  };

  handleChange = e => {
    const { value } = e.target;

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
      IGNORED_KEYS.indexOf(e.key) === -1
    ) {
      this.keypresses += 1;

      this.setState(state => ({
        recordedKeys: sortKeys([...state.recordedKeys, upperCaseKey]),
      }));
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
