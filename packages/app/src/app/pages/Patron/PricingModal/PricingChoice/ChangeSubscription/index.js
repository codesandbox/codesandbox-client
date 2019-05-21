import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import { SmallText, Buttons, StyledButton } from './elements';

function ChangeSubscription({
  cancelSubscription,
  date,
  signals: {
    patron: { tryAgainClicked },
  },
  store: { patron },
  updateSubscription,
}) {
  const error = patron.error;

  if (error) {
    return (
      <div>
        There was a problem updating this subscription.
        <SmallText>{error}</SmallText>
        <Buttons>
          <StyledButton onClick={tryAgainClicked}>Try again</StyledButton>
        </Buttons>
      </div>
    );
  }

  const buttons = patron.isUpdatingSubscription ? (
    <Buttons>
      <StyledButton disabled>Processing...</StyledButton>
    </Buttons>
  ) : (
    <Buttons>
      <StyledButton onClick={cancelSubscription} red>
        Cancel
      </StyledButton>

      <StyledButton onClick={updateSubscription}>Update</StyledButton>
    </Buttons>
  );

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
