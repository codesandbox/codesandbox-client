import React, { useState } from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import { format } from 'date-fns';
import { LinkButton } from 'app/components/LinkButton';

import { SmallText, Buttons, StyledButton, StripeInput } from './elements';

interface Props {
  date: string;
  markedAsCancelled: boolean;
  cancelSubscription: () => void;
  updateSubscription: (params: { coupon: string }) => void;
  store: any;
  signals: any;
}

function ChangeSubscription({
  date,
  markedAsCancelled,
  cancelSubscription,
  updateSubscription,
  store,
  signals,
}: Props) {
  const isLoading = store.patron.isUpdatingSubscription;
  const error = store.patron.error;

  const [coupon, setCoupon] = useState('');

  if (error) {
    return (
      <div>
        There was a problem updating this subscription.
        <SmallText>{error}</SmallText>
        <Buttons>
          <StyledButton onClick={() => signals.patron.tryAgainClicked()}>
            Try again
          </StyledButton>
        </Buttons>
      </div>
    );
  }

  let buttons = (
    <>
      <div style={{ margin: '1rem 5rem', marginTop: '2rem' }}>
        <StripeInput
          onChange={e => setCoupon(e.target.value)}
          value={coupon}
          placeholder="Apply Coupon Code"
        />
      </div>

      <Buttons>
        <StyledButton onClick={() => cancelSubscription()} red>
          Cancel
        </StyledButton>
        <StyledButton onClick={() => updateSubscription({ coupon })}>
          Update
        </StyledButton>
      </Buttons>
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

  if (isLoading) {
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
        You will be billed every <strong>{format(date, 'Do')}</strong> of the
        month, you can change or cancel your subscription at any time. You can
        change your payment method in{' '}
        <LinkButton
          onClick={e => {
            e.preventDefault();
            signals.modalOpened({ modal: 'preferences' });
          }}
        >
          user preferences
        </LinkButton>
        .
      </SmallText>
    </div>
  );
}

export default inject('signals', 'store')(hooksObserver(ChangeSubscription));
