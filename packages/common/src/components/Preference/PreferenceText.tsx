import * as React from 'react';
import Input, { TextArea } from '../Input';

export type Props = {
  setValue: (value: string) => void;
  value: string;
  placeholder?: string;
  isTextArea?: boolean;
};

export default class PreferenceText extends React.PureComponent<Props> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
