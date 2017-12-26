import React from 'react';

import moment from 'moment';
import logError from 'app/utils/error';

import { SmallText, Buttons, StyledButton } from './elements';

export default class ChangeSubscription extends React.PureComponent {
  state = {
    loading: false,
  };

  updateSubscription = async () => {
    this.setState({ loading: true });
    try {
      await this.props.updateSubscription();
    } catch (e) {
      console.error(e);
      logError(e);
    }
    this.setState({ loading: false });
  };

  cancelSubscription = async () => {
    this.setState({ loading: true });
    try {
      await this.props.cancelSubscription();
    } catch (e) {
      console.error(e);
      logError(e);
    }
    this.setState({ loading: false });
  };

  render() {
    const { date } = this.props;

    return (
      <div>
        <Buttons>
          <StyledButton
            disabled={this.state.loading}
            onClick={this.cancelSubscription}
            red
          >
            Cancel
          </StyledButton>
          <StyledButton
            disabled={this.state.loading}
            onClick={this.updateSubscription}
          >
            Update
          </StyledButton>
        </Buttons>
        <SmallText>
          You will be billed every <strong>{moment(date).format('Do')}</strong>{' '}
          of the month, you can change or cancel your subscription at any time.
        </SmallText>
      </div>
    );
  }
}
