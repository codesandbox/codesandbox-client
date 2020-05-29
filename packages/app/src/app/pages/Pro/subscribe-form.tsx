/**
 * Adapted from app/components/Subscrie
 * that used to be used in Patron page
 */

import { STRIPE_API_KEY } from '@codesandbox/common/es/utils/config';
import { useScript } from 'app/hooks';
import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { CheckoutForm } from './checkout-form';

interface ISubscribeFormProps {
  name: string;
  subscribe: (params: { token: string; coupon: string }) => void;
  isLoading?: boolean;
  error?: string;
  hasCoupon?: boolean;
  disabled?: boolean;
}

const context = window as any;

export const SubscribeForm: React.FC<ISubscribeFormProps> = ({
  name,
  subscribe,
  isLoading = false,
  error,
  hasCoupon,
  disabled = false,
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
          subscribe={subscribe}
          name={name}
          isLoading={isLoading}
          error={error}
          hasCoupon={hasCoupon}
          disabled={disabled}
        />
      </Elements>
    </StripeProvider>
  );
};
