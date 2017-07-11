import React from 'react';
import styled from 'styled-components';

import PricingInfo from './PricingInfo';
import PricingChoice from './PricingChoice';
import Badge from './Badge';

const Container = styled.div`
  margin: 8rem auto;
  width: 940px;
  padding: 1rem;
  background-color: ${props => props.theme.background};

  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 6rem;

  > div {
    flex: 1;
  }
`;

export default class PricingModal extends React.PureComponent {
  state = {
    price: 10,
  };

  setPrice = (price: number) => {
    this.setState({ price })
  }

  getBadge = () => {
    const { price } = this.state;

    if (price >= 30) return 'diamond';
    if (price >= 20) return 'rupee';
    if (price >= 10) return 'sapphire';
    return 'ruby';
  }

  render() {
    const { price } = this.state;
    const badge = this.getBadge();
    return (
      <Container>
        <Badge badge={badge}/>
        <Details>
          <PricingInfo />
          <PricingChoice badge={badge} price={price} setPrice={this.setPrice} />
        </Details>
      </Container>
    )
  }
}
