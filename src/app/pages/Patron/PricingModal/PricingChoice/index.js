import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import type { CurrentUser } from 'common/types';

import Input from 'app/components/Input';
import Centered from 'app/components/flex/Centered';
import Relative from 'app/components/Relative';
import SubscribeForm from 'app/components/user/SubscribeForm';
import SignInButton from 'app/containers/SignInButton';

import { loggedInSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';

import badges from 'app/utils/badges/patron-info';

import Range from './Range';
import ChangeSubscription from './ChangeSubscription';
import ThankYou from './ThankYou';

import Title from '../Title';

const Container = styled.div`padding: 1rem 0;`;

const PriceInput = styled(Input)`
  font-size: 1.5rem;
  padding-left: 2rem;
  padding-right: 1rem;
  width: 7rem;
  margin-bottom: 1rem;
  text-align: center;
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

const Notice = styled.p`
  font-size: 0.875rem;
  text-align: center;
  margin: 2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
`;

const RangeContainer = styled.div`width: 300px;`;

const StyledSignInButton = styled(SignInButton)`
  display: block;
  margin-top: 2rem;
  width: 300px;
`;

type Props = {
  price: number,
  setPrice: (price: number) => void,
  badge: string,
  userActions: typeof userActionCreators,
  loggedIn: boolean,
  user: CurrentUser,
};

const mapStateToProps = state => ({
  loggedIn: loggedInSelector(state),
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class PricingChoice extends React.PureComponent {
  props: Props;

  handleEventChange = e => {
    this.props.setPrice(+e.target.value);
  };

  handleRangeChange = value => {
    this.props.setPrice(value);
  };

  subscribe = (token: string) =>
    this.props.userActions.createSubscription(token, this.props.price);

  updateSubscription = () =>
    this.props.userActions.updateSubscription(this.props.price);

  cancelSubscription = async () => {
    // eslint-disable-next-line no-alert
    const confirmed = confirm(
      'Are you sure you want to cancel your subscription?'
    );

    if (confirmed) {
      return this.props.userActions.cancelSubscription();
    }

    return false;
  };

  render() {
    const { price, badge, loggedIn, user } = this.props;

    const subscribed = Boolean(loggedIn && user.subscription);

    return (
      <Container>
        <Centered horizontal vertical={false}>
          <Title>Pay what you want</Title>
          {subscribed && (
            <ThankYou
              price={user.subscription.amount}
              color={badges[badge].colors[0]}
            />
          )}
          <Relative>
            <Currency>$</Currency>
            <PriceInput
              onChange={this.handleEventChange}
              value={price}
              type="number"
            />
            <Month>/month</Month>
          </Relative>
          <RangeContainer>
            <Range
              onChange={this.handleRangeChange}
              min={5}
              max={50}
              step={1}
              value={price}
              color={badges[badge].colors[0]}
            />
          </RangeContainer>
          {loggedIn ? user.subscription ? ( // eslint-disable-line no-nested-ternary
            <ChangeSubscription
              updateSubscription={this.updateSubscription}
              cancelSubscription={this.cancelSubscription}
              date={user.subscription.since}
            />
          ) : (
            <Centered style={{ marginTop: '2rem' }} horizontal>
              <SubscribeForm subscribe={this.subscribe} name={user.name} />
              <Notice>
                You will be billed now and on the{' '}
                <strong style={{ color: 'white' }}>
                  {moment().format('Do')}
                </strong>{' '}
                of each month thereafter. You can cancel or change your
                subscription at any time.
              </Notice>
            </Centered>
          ) : (
            <StyledSignInButton />
          )}
        </Centered>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PricingChoice);
