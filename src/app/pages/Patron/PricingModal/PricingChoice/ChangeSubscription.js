import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Button from 'app/components/buttons/Button';

import logError from 'app/utils/error';

const SmallText = styled.div`
  text-align: center;
  font-size: 0.875rem;

  margin: 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`margin: 1rem;`;

type Props = {
  date: string,
  updateSubscription: () => void,
  cancelSubscription: () => void,
};

export default class ChangeSubscription extends React.PureComponent {
  props: Props;
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
          You will be billed every <strong>
            {moment(date).format('Do')}
          </strong>{' '}
          of the month, you can change or cancel your subscription at any time.
        </SmallText>
      </div>
    );
  }
}
