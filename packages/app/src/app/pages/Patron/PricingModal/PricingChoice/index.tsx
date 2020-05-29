import Centered from '@codesandbox/common/es/components/flex/Centered';
import Relative from '@codesandbox/common/es/components/Relative';
import { PatronBadge } from '@codesandbox/common/es/types';
import badges from '@codesandbox/common/es/utils/badges/patron-info';
import { SubscribeForm } from 'app/components/SubscribeForm';
import { useOvermind } from 'app/overmind';
import { format } from 'date-fns';
import React, { FunctionComponent } from 'react';

import { Title } from '../elements';
import { ChangeSubscription } from './ChangeSubscription';
import {
  Container,
  Currency,
  Month,
  Notice,
  PriceInput,
  RangeContainer,
  StyledSignInButton,
} from './elements';
import { Range } from './Range';
import { ThankYou } from './ThankYou';

type Props = {
  badge: PatronBadge;
};
export const PricingChoice: FunctionComponent<Props> = ({ badge }) => {
  const {
    actions: {
      patron: { priceChanged, createSubscriptionClicked },
    },
    state: { isLoggedIn, isPatron, user, patron },
  } = useOvermind();

  return (
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
            <ChangeSubscription />
          ) : (
            <Centered style={{ marginTop: '2rem' }} horizontal>
              <SubscribeForm
                subscribe={({ token, coupon }) =>
                  createSubscriptionClicked({
                    token,
                    coupon,
                    duration: 'monthly',
                  })
                }
                isLoading={patron.isUpdatingSubscription}
                hasCoupon
                name={user.name}
                error={patron.error}
              />
              <Notice>
                You will be billed now and on the{' '}
                <strong style={{ color: 'white' }}>
                  {format(new Date(), 'do')}
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
};
