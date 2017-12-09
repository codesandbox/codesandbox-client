import React from 'react';

import KeybindingInput from './KeybindingInput';

type Props = {
  value: {
    firstStroke: Array<string>,
    secondStroke: Array<string>,
  },
  setValue: Function,
};

export default class PreferenceKeybinding extends React.PureComponent {
  props: Props;

  setValue = (index: number) => (value: Array<string>) => {
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
          value={value[1]}
          setValue={this.setValue(1)}
          disabled={!value[0] || value[0].length === 0}
        />
      </div>
    );
  }
}
