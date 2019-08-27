import React from 'react';
import { format } from 'date-fns';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Relative from '@codesandbox/common/lib/components/Relative';
import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import { inject, hooksObserver } from 'app/componentConnectors';
import { SubscribeForm } from 'app/components/SubscribeForm';
import Range from './Range';
import ChangeSubscription from './ChangeSubscription';
import { ThankYou } from './ThankYou';
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

interface Props {
  badge: 'patron-1' | 'patron-2' | 'patron-3' | 'patron-4';
  store: any;
  signals: any;
}

const PricingChoice = inject('store', 'signals')(
  hooksObserver(
    ({
      badge,
      store: { isLoggedIn, isPatron, user, patron },
      signals: {
        patron: {
          priceChanged,
          createSubscriptionClicked,
          updateSubscriptionClicked,
          cancelSubscriptionClicked,
        },
      },
    }: Props) => (
      <Container>
        <Centered horizontal vertical={false}>
          <Title>Pay what you want</Title>
          {isPatron && (
            <ThankYou
              price={user.subscription.amount}
              color={badges[badge].colors[0]}
              markedAsCancelled={user.subscription.cancelAtPeriodEnd}
            />
          )}
          <Relative>
            <Currency>$</Currency>
            <PriceInput
              onChange={e => priceChanged({ price: Number(e.target.value) })}
              value={patron.price}
              min={5}
              type="number"
            />
            <Month>/month</Month>
          </Relative>
          <RangeContainer>
            <Range
              onChange={value => priceChanged({ price: Number(value) })}
              min={5}
              max={50}
              step={1}
              value={patron.price}
              color={badges[badge].colors[0]}
            />
          </RangeContainer>
          {isLoggedIn ? ( // eslint-disable-line no-nested-ternary
            isPatron ? (
              <ChangeSubscription
                updateSubscription={props => updateSubscriptionClicked(props)}
                cancelSubscription={() => cancelSubscriptionClicked()}
                date={user.subscription.since}
                markedAsCancelled={user.subscription.cancelAtPeriodEnd}
              />
            ) : (
              <Centered style={{ marginTop: '2rem' }} horizontal>
                <SubscribeForm
                  subscribe={({ token, coupon }) =>
                    createSubscriptionClicked({ token, coupon })
                  }
                  isLoading={patron.isUpdatingSubscription}
                  hasCoupon
                  name={user.name}
                  error={patron.error}
                />
                <Notice>
                  You will be billed now and on the{' '}
                  <strong style={{ color: 'white' }}>
                    {format(new Date(), 'Do')}
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
    )
  )
);

export default PricingChoice;
