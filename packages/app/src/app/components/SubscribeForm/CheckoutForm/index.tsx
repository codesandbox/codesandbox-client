import React, { useState } from 'react';
import { injectStripe } from 'react-stripe-elements';
import { logError } from '@codesandbox/common/lib/utils/analytics';
import {
  CardContainer,
  Card,
  NameInput,
  ErrorText,
  Label,
  Submit,
} from './elements';

interface ICheckoutFormProps {
  name?: string;
  loading: boolean;
  buttonName: string;
  loadingText: string;
  error: Error;
  stripe: any;
  subscribe: (id: string) => void;
}

interface IErrorsState {
  name?: string;
  stripe?: Error;
}

const CheckoutForm = ({
  name = ``,
  loading,
  buttonName,
  loadingText,
  error,
  stripe,
  subscribe,
}: ICheckoutFormProps) => {
  const [cardholderName, setCardholderName] = useState(name);
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IErrorsState>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrors({ name: 'Please provide a name ' });
      return;
    }

    setLoading(true);
    setErrors({});

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    const { token, error: stripeErr } = await stripe.createToken({ name });
    if (stripeErr) {
      setLoading(false);
      setErrors({ stripe: stripeErr.message });
      return;
    }

    try {
      await subscribe(token.id);
    } catch (subscribeErr) {
      logError(subscribeErr);
      setLoading(false);
      setErrors({ stripe: subscribeErr.message });
      return;
    }

    setLoading(false);
  };

  const loadingState = isLoading || loading;

  const stripeError = errors.stripe || error;

  return (
    <form onSubmit={handleSubmit}>
      <Label>Cardholder Name</Label>
      {errors.name != null && <ErrorText>{errors.name}</ErrorText>}
      <div>
        <NameInput
          value={cardholderName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCardholderName(e.target.value)
          }
          error={Boolean(errors.name)}
          placeholder="Please enter your name"
        />
      </div>

      <Label>Card</Label>
      {stripeError != null && <ErrorText>{stripeError}</ErrorText>}
      <CardContainer>
        <Card />
      </CardContainer>

      <Submit disabled={loadingState}>
        {loadingState ? loadingText : buttonName}
      </Submit>
    </form>
  );
};

export default injectStripe(CheckoutForm);
