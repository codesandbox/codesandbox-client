import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Relative from '@codesandbox/common/lib/components/Relative';
import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';

import SubscribeForm from 'app/components/SubscribeForm';

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

const PricingChoice = ({
  badge,
  signals: {
    patron: {
      cancelSubscriptionClicked,
      createSubscriptionClicked,
      priceChanged,
      updateSubscriptionClicked,
    },
  },
  store: { isLoggedIn, isPatron, patron, user },
}) => (
  <Container>
    <Centered horizontal vertical={false}>
      <Title>Pay what you want</Title>

      {isPatron && (
        <ThankYou
          color={badges[badge].colors[0]}
          price={user.subscription.amount}
        />
      )}

      <Relative>
        <Currency>$</Currency>

        <PriceInput
          min={5}
          onChange={event =>
            priceChanged({ price: Number(event.target.value) })
          }
          type="number"
          value={patron.price}
        />

        <Month>/month</Month>
      </Relative>

      <RangeContainer>
        <Range
          color={badges[badge].colors[0]}
          max={50}
          min={5}
          onChange={value => priceChanged({ price: Number(value) })}
          step={1}
          value={patron.price}
        />
      </RangeContainer>

      {isLoggedIn ? ( // eslint-disable-line no-nested-ternary
        isPatron ? (
          <ChangeSubscription
            updateSubscription={updateSubscriptionClicked}
            cancelSubscription={cancelSubscriptionClicked}
            date={user.subscription.since}
          />
        ) : (
          <Centered style={{ marginTop: '2rem' }} horizontal>
            <SubscribeForm
              subscribe={token => createSubscriptionClicked({ token })}
              isLoading={patron.isUpdatingSubscription}
              name={user.name}
              error={patron.error}
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

export default inject('store', 'signals')(observer(PricingChoice));
