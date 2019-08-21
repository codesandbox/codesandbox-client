import React from 'react';
import { inject, observer } from 'app/componentConnectors';
import { SubscribeForm } from 'app/components/SubscribeForm';
import Card from './Card';
import { Title, Subheading } from '../elements';
import { Container } from './elements';

interface Props {
  store: any;
  signals: any;
}

class PaymentInfo extends React.Component<Props> {
  componentDidMount() {
    this.props.signals.preferences.paymentDetailsRequested();
  }

  updatePaymentDetails = ({ token }) => {
    this.props.signals.preferences.paymentDetailsUpdated({ token });
  };

  paymentDetails = () => {
    const { preferences } = this.props.store;

    if (preferences.paymentDetailError)
      return <div>An error occurred: {preferences.paymentDetailError}</div>;

    return (
      <div>
        <Subheading>Current card</Subheading>
        <Card
          last4={preferences.paymentDetails.last4}
          name={preferences.paymentDetails.name}
          brand={preferences.paymentDetails.brand}
        />

        <Subheading style={{ marginTop: '2rem' }}>Update card info</Subheading>
        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={preferences.paymentDetails.name}
          subscribe={this.updatePaymentDetails}
        />
      </div>
    );
  };

  render() {
    const { preferences } = this.props.store;
    return (
      <Container>
        <Title>Payment Info</Title>
        {preferences.isLoadingPaymentDetails ? (
          <div>Loading payment details...</div>
        ) : (
          this.paymentDetails()
        )}
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(PaymentInfo));
