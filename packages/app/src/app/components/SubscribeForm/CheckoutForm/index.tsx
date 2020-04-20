import React from 'react';
import {
  injectStripe,
  CardElement,
  ReactStripeElements,
} from 'react-stripe-elements';
import { withTheme } from 'styled-components';
import css from '@styled-system/css';
import { logError } from '@codesandbox/common/lib/utils/analytics';
import { Button, Label, Element } from '@codesandbox/components';

import { CardContainer, StripeInput, ErrorText } from './elements';

interface Props {
  name: string;
  buttonName: string;
  loadingText: string;
  isLoading: boolean;
  subscribe: (params: { token: string; coupon: string }) => void;
  stripe?: ReactStripeElements.StripeProps;
  error?: Error | string;
  hasCoupon?: boolean;
  theme?: any;
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
    const {
      buttonName,
      loadingText,
      isLoading,
      error,
      hasCoupon = false,
      theme,
    } = this.props;
    const { errors, loading: stateLoading } = this.state;

    const loading = isLoading || stateLoading;

    const stripeError = errors.stripe || error;

    return (
      <form onSubmit={this.handleSubmit}>
        <Label variant="muted" size={3} paddingBottom={1}>
          Cardholder Name
        </Label>
        {errors.name != null && <ErrorText>{errors.name}</ErrorText>}
        <Element>
          <StripeInput
            value={this.state.name}
            onChange={this.setName}
            placeholder="Please enter your name"
          />
        </Element>

        <Label variant="muted" size={3} paddingBottom={1}>
          Card
        </Label>
        {stripeError != null && <ErrorText>{stripeError}</ErrorText>}
        <CardContainer>
          <Element
            css={css({
              height: '32px',
              paddingTop: '6px',
              width: '100%',
              paddingX: 2,
              fontSize: 3,
              lineHeight: 1, // trust the height
              fontFamily: 'Inter, sans-serif',
              borderRadius: 'small',
              backgroundColor: 'input.background',
              border: '1px solid',
              borderColor: 'input.border',
              color: 'input.foreground',
            })}
          >
            <CardElement
              style={{
                base: {
                  color: theme.colors.input.foreground,
                },
              }}
            />
          </Element>
        </CardContainer>

        {hasCoupon && (
          <>
            <Label variant="muted" size={3} paddingBottom={1}>
              Coupon
            </Label>
            <Element>
              <StripeInput
                value={this.state.coupon}
                onChange={this.setCoupon}
                placeholder="Coupon or Discount Code"
              />
            </Element>
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          style={{ marginTop: '1rem', width: 300 }}
        >
          {loading ? loadingText : buttonName}
        </Button>
      </form>
    );
  }
}
// @ts-ignore
export const CheckoutForm = injectStripe(withTheme(CheckoutFormComponent));
