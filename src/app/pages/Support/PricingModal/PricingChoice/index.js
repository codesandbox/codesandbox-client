import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Input from 'app/components/Input';
import Centered from 'app/components/flex/Centered';
import Relative from 'app/components/Relative';
import Button from 'app/components/buttons/Button';

import Range from './Range';
import CardInfo from './CardInfo';
import Title from '../Title';

import badges from '../Badge/badge-info';

const Container = styled.div`padding: 1rem 0;`;

const PriceInput = styled(Input)`
  font-size: 1.5rem;
  padding-left: 2rem;
  padding-right: 1rem;
  width: 6rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Notice = styled.p`
  font-size: .875rem;
  text-align: center;
  margin: 2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
`;

const Month = styled.span`
  position: absolute;
  margin-left: 0.5rem;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 1);
  left: 100%;
  font-weight: 300;
  bottom: 1.75rem;
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

const RangeContainer = styled.div`width: 300px;`;

type Props = {
  price: number;
  setPrice: (price: number) => void;
  badge: string;
};

export default class PricingChoice extends React.PureComponent {
  props: Props;

  handleEventChange = e => {
    this.props.setPrice(+e.target.value);
  };

  handleRangeChange = value => {
    this.props.setPrice(value)
  };

  render() {
    const { price, badge } = this.props;

    return (
      <Container>
        <Centered horizontal vertical={false}>
          <Title>Pay what you want</Title>

          <Relative>
            <Currency>$</Currency>
            <PriceInput onChange={this.handleEventChange} value={price} type="number" />
            <Month>/month</Month>
          </Relative>
          <RangeContainer>
            <Range
              onChange={this.handleRangeChange}
              min={5}
              max={50}
              step={1}
              value={price}
              color={badges[badge].color}
            />
          </RangeContainer>
          <CardInfo />
          <Button style={{ marginTop: '1rem', width: 300 }}>Subscribe</Button>
          <Notice>
            You will be billed now and on the{' '}
            <strong style={{ color: 'white' }}>
              {moment().format('Do')}
            </strong>{' '}
            of each month thereafter. You can cancel or change your subscription
            at any time.
          </Notice>
        </Centered>
      </Container>
    );
  }
}
