import { STRIPE_API_KEY } from '@codesandbox/common/lib/utils/config';

function loadScript(path: string) {
  return new Promise(resolve => {
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.onload = resolve;
      script.async = true;
      script.type = 'text/javascript';
      script.src = path;
      document.head.appendChild(script);
    }
  });
}

let localStripeVar: stripe.Stripe;
const getStripe = async (): Promise<stripe.Stripe> => {
  if (typeof Stripe === 'undefined') {
    await loadScript('https://js.stripe.com/v3/');
  }

  if (!localStripeVar) {
    localStripeVar = Stripe(STRIPE_API_KEY);
  }

  return localStripeVar;
};

export default {
  handleCardPayment: async (paymentIntent: string) => {
    const stripe = await getStripe();

    return stripe.handleCardPayment(paymentIntent);
  },
};
