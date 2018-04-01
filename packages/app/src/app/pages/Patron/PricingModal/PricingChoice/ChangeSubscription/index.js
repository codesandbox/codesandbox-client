import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import { SmallText, Buttons, StyledButton } from './elements';

function ChangeSubscription({ date, store, signals }) {
  const isLoading = store.patron.isUpdatingSubscription;
  const error = store.patron.error;

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
    <Buttons>
      <StyledButton onClick={() => this.props.cancelSubscription()} red>
        Cancel
      </StyledButton>
      <StyledButton onClick={() => this.props.updateSubscription()}>
        Update
      </StyledButton>
    </Buttons>
  );

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
        You will be billed every <strong>{moment(date).format('Do')}</strong> of
        the month, you can change or cancel your subscription at any time.
      </SmallText>
    </div>
  );
}

export default inject('store', 'signals')(observer(ChangeSubscription));
