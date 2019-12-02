/**
 * Adapted from app/components/CheckoutForm
 * that used to be used in Patron page
 */

import React from 'react';
import {
  injectStripe,
  CardElement,
  ReactStripeElements,
} from 'react-stripe-elements';

import { logError } from '@codesandbox/common/lib/utils/analytics';

import {
  CardContainer,
  Form,
  FormField,
  Label,
  Input,
  Button,
  ErrorText,
  HelpText,
} from './elements';

interface Props {
  name: string;
  isLoading: boolean;
  subscribe: (params: { token: string; coupon: string }) => void;
  stripe?: ReactStripeElements.StripeProps;
  error?: Error | string;
  hasCoupon?: boolean;
  disabled?: boolean;
}

interface State {
  errors: {
    name?: string;
    stripe?: string;
  };
  name: string;
  coupon: string;
  loading: boolean;
}

class CheckoutFormComponent extends React.PureComponent<Props, State> {
  state: State = {
    errors: {},
    name: this.props.name || '',
    coupon: '',
    loading: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.name !== this.props.name) {
      this.setState({ errors: {}, name: nextProps.name });
    }
  }

  setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      this.setState({ errors: {}, name: e.target.value });
    }
  };

  setCoupon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      this.setState({ errors: {}, coupon: e.target.value });
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.state.name) {
      return this.setState({ errors: { name: 'Please provide a name ' } });
    }

    this.setState({ loading: true, errors: {} });

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    const { token, error } = await this.props.stripe.createToken({
      name: this.state.name,
    });
    if (error) {
      return this.setState({
        loading: false,
        errors: {
          stripe: error.message,
        },
      });
    }

    try {
      await this.props.subscribe({
        token: token.id,
        coupon: this.state.coupon,
      });
    } catch (err) {
      logError(err);

      return this.setState({
        loading: false,
        errors: {
          stripe: err.message,
        },
      });
    }

    return this.setState({
      loading: false,
    });
  };

  render() {
    const { isLoading, error, hasCoupon = false, disabled } = this.props;
    const { errors, loading: stateLoading } = this.state;

    const loading = isLoading || stateLoading;

    const stripeError = errors.stripe || error;

    return (
      <Form onSubmit={this.handleSubmit} disabled={disabled}>
        <FormField>
          <Label htmlFor="cardholder-name">Cardholder Name</Label>
          <Input
            id="cardholder-name"
            value={this.state.name}
            onChange={this.setName}
            placeholder="Please enter your name"
            disabled={disabled}
          />
          {errors.name != null && <ErrorText>{errors.name}</ErrorText>}
        </FormField>

        <FormField>
          <Label htmlFor="card-number">Card</Label>

          <CardContainer>
            <CardElement
              id="card-number"
              style={{ base: { color: 'white', fontWeight: '500' } }}
              disabled={disabled}
            />
          </CardContainer>
          {stripeError != null && <ErrorText>{stripeError}</ErrorText>}
        </FormField>

        {hasCoupon && (
          <FormField>
            <Label htmlFor="coupon">Coupon</Label>
            <div>
              <Input
                id="coupon"
                value={this.state.coupon}
                onChange={this.setCoupon}
                placeholder="Coupon or Discount Code"
                disabled={disabled}
              />
            </div>
          </FormField>
        )}

        <Button
          type="submit"
          disabled={loading || disabled}
          style={{ marginTop: '1rem', width: 300 }}
        >
          {loading ? 'Creating Subscription...' : 'Subscribe to Pro'}
        </Button>

        <HelpText>
          You will be billed now and on the <b>30th</b> of each month
          thereafter. You can cancel or change your subscription at any time.
        </HelpText>
      </Form>
    );
  }
}

export const CheckoutForm = injectStripe(CheckoutFormComponent);
