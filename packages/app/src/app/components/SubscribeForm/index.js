import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { STRIPE_API_KEY } from 'common/lib/utils/config';
import CheckoutForm from './CheckoutForm';

import { Container } from './elements';

function SubscribeForm({
  name,
  subscribe,
  loadingText = 'Creating Subscription...',
  buttonName = 'Subscribe',
  isLoading = false,
  error,
}) {
  return (
    <Container>
      <StripeProvider apiKey={STRIPE_API_KEY}>
        <Elements>
          <CheckoutForm
            buttonName={buttonName}
            loadingText={loadingText}
            subscribe={subscribe}
            name={name}
            isLoading={isLoading}
            error={error}
          />
        </Elements>
      </StripeProvider>
    </Container>
  );
}

export default SubscribeForm;
