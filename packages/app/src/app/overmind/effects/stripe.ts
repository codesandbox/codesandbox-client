import { STRIPE_API_KEY } from '@codesandbox/common/lib/utils/config';

let localStripeVar: any;
const getStripe = () => {
  if (!localStripeVar) {
    // @ts-ignore
    localStripeVar = window.Stripe(STRIPE_API_KEY);
  }

  return localStripeVar;
};

export default {
  handleCardPayment: (paymentIntent: string) => {
    const stripe = getStripe();

    return stripe.handleCardPayment(paymentIntent);
  },
};
