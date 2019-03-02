import * as React from 'react';
import KeybindingInput from './KeybindingInput';

export type Props = {
  setValue: (value: Array<string[]>) => void;
  value: Array<string[]>;
};

export default class PreferenceKeybinding extends React.PureComponent<Props> {
  setValue = index => value => {
    const result = [...this.props.value];
    result[index] = value;

    this.props.setValue(result);
  };

  render() {
    const { value } = this.props;

    return (
      <div>
        <KeybindingInput
          {...this.props}
          placeholder="First"
          value={value[0]}
          setValue={this.setValue(0)}
        />
        {' - '}
        <KeybindingInput
          {...this.props}
          placeholder="Second"
          value={value.length === 2 && value[1]}
          setValue={this.setValue(1)}
          disabled={!value[0] || value[0].length === 0}
        />
      </div>
    );
  }
}
