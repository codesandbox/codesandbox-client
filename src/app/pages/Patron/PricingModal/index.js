import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';

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

type Props = {
  user: CurrentUser,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
class PricingModal extends React.PureComponent {
  props: Props;

  constructor(props) {
    super(props);

    const price = this.getPrice(props);

    this.state = {
      price,
    };
  }

  getPrice = props =>
    (props.user && props.user.subscription && props.user.subscription.amount) ||
    10;

  componentWillReceiveProps(nextProps) {
    const currentPrice = this.getPrice(this.props);
    const nextPrice = this.getPrice(nextProps);

    if (nextPrice && currentPrice !== nextPrice) {
      this.setState({ price: nextPrice });
    }
  }

  setPrice = (price: number) => {
    this.setState({ price });
  };

  getPatronTier = () => {
    const { price } = this.state;

    if (price >= 35) return 4;
    if (price >= 25) return 3;
    if (price >= 15) return 2;
    return 1;
  };

  render() {
    const { user } = this.props;
    const { price } = this.state;
    const tier = this.getPatronTier();
    const badge = `patron-${tier}`;
    const subscribed = Boolean(user && user.subscription);

    return (
      <Container>
        <Badge subscribed={subscribed} badge={badge} />
        <Details>
          <PricingInfo />
          <PricingChoice
            user={user}
            badge={badge}
            price={price}
            setPrice={this.setPrice}
          />
        </Details>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(PricingModal);
