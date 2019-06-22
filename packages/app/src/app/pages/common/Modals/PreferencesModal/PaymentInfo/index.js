import React from 'react';
import { inject, observer } from 'mobx-react';

import SubscribeForm from 'app/components/SubscribeForm';

import Card from './Card';
import { Title, Subheading } from '../elements';
import { Container } from './elements';

class PaymentInfo extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line
    this.props.signals.preferences.paymentDetailsRequested();
  }

  updatePaymentDetails = ({ token }) => {
    // eslint-disable-next-line
    this.props.signals.preferences.paymentDetailsUpdated({ token });
  };

  paymentDetails = () => {
    const {
      store: {
        preferences: { paymentDetails, paymentDetailError },
      },
    } = this.props;

    if (paymentDetailError)
      return <div>An error occurred: {paymentDetailError}</div>;

    return (
      <div>
        <Subheading>Current card</Subheading>
        <Card
          last4={paymentDetails.last4}
          name={paymentDetails.name}
          brand={paymentDetails.brand}
        />

        <Subheading style={{ marginTop: '2rem' }}>Update card info</Subheading>
        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={paymentDetails.name}
          subscribe={this.updatePaymentDetails}
        />
      </div>
    );
  };

  render() {
    const {
      store: {
        preferences: { isLoadingPaymentDetails },
      },
    } = this.props;
    return (
      <Container>
        <Title>Payment Info</Title>
        {isLoadingPaymentDetails ? (
          <div>Loading payment details...</div>
        ) : (
          this.paymentDetails()
        )}
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(PaymentInfo));
