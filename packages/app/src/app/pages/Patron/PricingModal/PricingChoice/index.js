import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import Centered from 'common/lib/components/flex/Centered';
import Relative from 'common/lib/components/Relative';
import SubscribeForm from 'app/components/SubscribeForm';
import badges from 'common/lib/utils/badges/patron-info';

import Range from './Range';
import ChangeSubscription from './ChangeSubscription';
import ThankYou from './ThankYou';
import { Title } from '../elements';
import {
  Container,
  PriceInput,
  Month,
  Currency,
  Notice,
  RangeContainer,
  StyledSignInButton,
} from './elements';

function PricingChoice({ store, signals, badge }) {
  return (
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
            min={5}
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
                isLoading={store.patron.isUpdatingSubscription}
                name={store.user.name}
                error={store.patron.error}
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
  );
}

export default inject('store', 'signals')(observer(PricingChoice));
