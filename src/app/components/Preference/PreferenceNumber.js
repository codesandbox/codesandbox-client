import React from 'react';
import styled from 'styled-components';

import Input from 'app/components/Input';

const StyledInput = styled(Input)`text-align: center;`;

type Props = {
  value: boolean,
  setValue: boolean => any,
  style: Object,
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
    const { value, style } = this.props;
    return (
      <StyledInput
        style={{ width: '3rem', ...style }}
        type="number"
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}
