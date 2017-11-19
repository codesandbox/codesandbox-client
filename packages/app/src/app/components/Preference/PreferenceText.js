import React from 'react';

import Input from 'app/components/Input';

type Props = {
  value: boolean,
  setValue: boolean => any,
  placeholder: string,
};

export default class PreferenceText extends React.PureComponent {
  props: Props;

  handleChange = e => {
    const value = e.target.value;

    this.props.setValue(value);
  };

  render() {
    const { value, placeholder } = this.props;
    return (
      <Input
        style={{ width: '9rem' }}
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
      />
    );
  }
}
