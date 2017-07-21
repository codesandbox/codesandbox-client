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
    const { value } = this.props;
    return (
      <StyledInput type="number" value={value} onChange={this.handleChange} />
    );
  }
}
