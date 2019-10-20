import React from 'react';
import { StyledInput } from './elements';

export type Props = {
  setValue: (value: number) => void;
  value: number;
  placeholder?: string;
  step?: number;
  style?: React.CSSProperties;
};

export default class PreferenceInput extends React.PureComponent<Props> {
  handleChange = e => {
    const { value } = e.target;

    if (!Number.isNaN(+value)) {
      this.props.setValue(+value);
    }
  };

  render() {
    const { value, placeholder, style, step } = this.props;

    return (
      <StyledInput
        step={step}
        style={{ width: '3rem', ...style }}
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={this.handleChange}
      />
    );
  }
}
