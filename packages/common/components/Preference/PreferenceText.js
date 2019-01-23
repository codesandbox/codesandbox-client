import React from 'react';
import Input, { TextArea } from 'common/components/Input';

export default class PreferenceText extends React.PureComponent {
  handleChange = e => {
    const value = e.target.value;

    this.props.setValue(value);
  };

  render() {
    const { value, placeholder, isTextArea, ...props } = this.props;

    return React.createElement(isTextArea ? TextArea : Input, {
      style: { width: '9rem' },
      value,
      placeholder,
      onChange: this.handleChange,
      ...props,
    });
  }
}
