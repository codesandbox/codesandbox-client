import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { format } from 'date-fns';
import { LinkButton } from 'app/components/LinkButton';

import {
  SmallText,
  Buttons,
  StyledButton,
  StripeInput,
  CancelText,
  Centered,
} from './elements';

interface IChangeSubscriptionProps {
  date: string;
  markedAsCancelled: boolean;
  cancelSubscription: () => void;
  updateSubscription: (params: { coupon: string }) => void;
}

export const ChangeSubscription: React.FC<IChangeSubscriptionProps> = ({
  date,
  markedAsCancelled,
  cancelSubscription,
  updateSubscription,
}) => {
  const {
    state: {
      patron: { isUpdatingSubscription, error },
    },
    actions: {
      modalOpened,
      patron: { tryAgainClicked },
    },
  } = useOvermind();

  const [coupon, setCoupon] = useState('');

  if (error) {
    return (
      <div>
        There was a problem updating this subscription.
        <SmallText>{error}</SmallText>
        <Buttons>
          <StyledButton onClick={() => tryAgainClicked()}>
            Try again
          </StyledButton>
        </Buttons>
      </div>
    );
  }

  let buttons = (
    <>
      <div style={{ margin: '0 5rem', marginTop: '2rem' }}>
        <StripeInput
          onChange={e => setCoupon(e.target.value)}
          value={coupon}
          placeholder="Apply Coupon Code"
        />
      </div>
      <Buttons>
        <StyledButton onClick={() => updateSubscription({ coupon })}>
          Update
        </StyledButton>
      </Buttons>
      <Centered>
        <CancelText onClick={() => cancelSubscription()}>
          Cancel my subscription
        </CancelText>
      </Centered>
    </>
  );

  if (markedAsCancelled) {
    buttons = (
      <Buttons>
        <StyledButton onClick={() => updateSubscription({ coupon: '' })}>
          Reactivate Subscription
        </StyledButton>
      </Buttons>
    );
  }

  if (isUpdatingSubscription) {
    buttons = (
      <Buttons>
        <StyledButton disabled>Processing...</StyledButton>
      </Buttons>
    );
  }

  return (
    <div>
      {buttons}
      <SmallText>
        You will be billed every <strong>{format(new Date(date), 'do')}</strong>{' '}
        of the month, you can change or cancel your subscription at any time.
        You can change your payment method in{' '}
        <LinkButton
          onClick={e => {
            e.preventDefault();
            modalOpened({ modal: 'preferences' });
          }}
        >
          user preferences
        </LinkButton>
        .
      </SmallText>
    </div>
  );
};
