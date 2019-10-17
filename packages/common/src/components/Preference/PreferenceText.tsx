import React from 'react';
import Input, { TextArea } from '../Input';

export type Props = {
  setValue: (value: string) => void;
  value: string;
  placeholder?: string;
  isTextArea?: boolean;
  style?: React.CSSProperties;
  block?: boolean;
  rows?: number;
};

export default class PreferenceText extends React.PureComponent<Props> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

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
