import React from 'react';
import styled from 'styled-components';

import Input from 'app/components/Input';
import Centered from 'app/components/flex/Centered';
import Relative from 'app/components/Relative';

import Range from './Range';

const Title = styled.h3`
  font-weight: 300;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin-top: 0;
`;

const PriceInput = styled(Input)`
  font-size: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 8rem;
  text-align: center;
`;

const Currency = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 1.5rem;
  font-weight: 300;
  padding-top: 8px;
  color: rgba(255, 255, 255, 0.5);
`;

const RangeContainer = styled.div`
  width: 60%;
  margin-top: 1rem;
`;

export default class PricingChoice extends React.PureComponent {
  state = {
    value: 15,
  };
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;
    return (
      <Centered horizontal vertical={false}>
        <Title>Pay what you want</Title>

        <Relative>
          <Currency>$</Currency>
          <PriceInput onChange={this.handleChange} value={value} />
        </Relative>
        <RangeContainer>
          <Range
            onChange={this.handleChange}
            min={7}
            max={100}
            step={1}
            value={value}
          />
        </RangeContainer>
      </Centered>
    );
  }
}
