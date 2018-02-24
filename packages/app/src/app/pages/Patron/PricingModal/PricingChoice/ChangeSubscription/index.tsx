import * as React from 'react';
import { connect } from 'app/fluent'
import * as moment from 'moment';

import { SmallText, Buttons, StyledButton } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    isLoading: state.patron.isUpdatingSubscription,
    error: state.patron.error,
    date: state.user.subscription.since,
    signals: { ...signals.patron }
  }))
  .to(
    function ChangeSubscription({ isLoading, date, error, signals }) {
      if (error) {
        return (
          <div>
            There was a problem updating this subscription.
            <SmallText>{error}</SmallText>
            <Buttons>
              <StyledButton onClick={() => signals.tryAgainClicked()}>
                Try again
              </StyledButton>
            </Buttons>
          </div>
        );
      }

      let buttons = (
        <Buttons>
          <StyledButton onClick={() => signals.cancelSubscriptionClicked()} red>
            Cancel
          </StyledButton>
          <StyledButton onClick={() => signals.updateSubcriptionClicked()}>
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
  )
