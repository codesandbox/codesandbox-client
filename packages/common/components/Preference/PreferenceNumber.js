import React from 'react';
import { StyledInput } from './elements';

export default class PreferenceInput extends React.PureComponent {
  handleChange = e => {
    const value = e.target.value;

    if (!Number.isNaN(+value)) {
      this.props.setValue(+value);
    }
  };

  render() {
    const { value, style, step } = this.props;

    return (
      <StyledInput
        step={step}
        style={{ width: '3rem', ...style }}
        type="number"
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}
