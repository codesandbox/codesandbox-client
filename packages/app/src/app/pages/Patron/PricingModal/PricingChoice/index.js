import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import styled from 'styled-components';

import Input from 'app/components/Input';
import Centered from 'common/components/flex/Centered';
import Relative from 'common/components/Relative';
import SubscribeForm from 'app/components/user/SubscribeForm';
import SignInButton from 'app/containers/SignInButton';
import badges from 'common/utils/badges/patron-info';
import Range from './Range';
import ChangeSubscription from './ChangeSubscription';
import ThankYou from './ThankYou';
import Title from '../Title';

const Container = styled.div`
  padding: 1rem 0;
`;

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

const RangeContainer = styled.div`
  width: 300px;
`;

const StyledSignInButton = styled(SignInButton)`
  display: block;
  margin-top: 2rem;
  width: 300px;
`;

export default inject('store', 'signals')(
  observer(({ store, signals, badge }) => (
    <Container>
      <Centered horizontal vertical={false}>
        <Title>Pay what you want</Title>
        {store.isPatron && (
          <ThankYou
            price={store.user.subscription.amount}
            color={badges[badge].colors[0]}
          />
        )}
        <Relative>
          <Currency>$</Currency>
          <PriceInput
            onChange={event =>
              signals.patron.priceChanged({ price: Number(event.target.value) })
            }
            value={store.patron.price}
            type="number"
          />
          <Month>/month</Month>
        </Relative>
        <RangeContainer>
          <Range
            onChange={value =>
              signals.patron.priceChanged({ price: Number(value) })
            }
            min={5}
            max={50}
            step={1}
            value={store.patron.price}
            color={badges[badge].colors[0]}
          />
        </RangeContainer>
        {store.isLoggedIn ? ( // eslint-disable-line no-nested-ternary
          store.isPatron ? (
            <ChangeSubscription
              updateSubscription={() =>
                signals.patron.updateSubscriptionClicked()
              }
              cancelSubscription={() =>
                signals.patron.cancelSubscriptionClicked()
              }
              date={store.user.subscription.since}
            />
          ) : (
            <Centered style={{ marginTop: '2rem' }} horizontal>
              <SubscribeForm
                subscribe={token =>
                  signals.patron.createSubscriptionClicked({ token })
                }
                name={store.user.name}
              />
              <Notice>
                You will be billed now and on the{' '}
                <strong style={{ color: 'white' }}>
                  {moment().format('Do')}
                </strong>{' '}
                of each month thereafter. You can cancel or change your
                subscription at any time.
              </Notice>
            </Centered>
          )
        ) : (
          <StyledSignInButton />
        )}
      </Centered>
    </Container>
  ))
);
