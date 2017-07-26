import React from 'react';
import styled from 'styled-components';

import Input from 'app/components/Input';

const StyledInput = styled(Input)`
  text-align: center;
`;

type Props = {
  value: boolean,
  setValue: boolean => any,
};

export default class PreferenceInput extends React.PureComponent {
  props: Props;

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
