/**
 * Adapted from app/components/Subscrie
 * that used to be used in Patron page
 */

import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { STRIPE_API_KEY } from '@codesandbox/common/lib/utils/config';
import { useScript } from 'app/hooks';
import { CheckoutForm } from './checkout-form';

interface ISubscribeFormProps {
  name: string;
  subscribe: (params: { token: string; coupon: string }) => void;
  loadingText?: string;
  buttonName?: string;
  isLoading?: boolean;
  error?: string;
  hasCoupon?: boolean;
}

const context = window as any;

export const SubscribeForm: React.FC<ISubscribeFormProps> = ({
  name,
  subscribe,
  loadingText = 'Creating Subscription...',
  buttonName = 'Subscribe',
  isLoading = false,
  error,
  hasCoupon,
}) => {
  const [stripe, setStripe] = React.useState(null);
  const [loaded] = useScript('https://js.stripe.com/v3/');

  React.useEffect(() => {
    if (context.Stripe) {
      setStripe(context.Stripe(STRIPE_API_KEY));
    }
  }, [loaded]);

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CheckoutForm
          buttonName={buttonName}
          loadingText={loadingText}
          subscribe={subscribe}
          name={name}
          isLoading={isLoading}
          error={error}
          hasCoupon={hasCoupon}
        />
      </Elements>
    </StripeProvider>
  );
};
