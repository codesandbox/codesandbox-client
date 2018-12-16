import React from 'react';
import { injectStripe, CardElement } from 'react-stripe-elements';
import reportError from 'app/utils/error';
import Button from 'app/components/Button';

import { CardContainer, NameInput, ErrorText, Label } from './elements';

class CheckoutForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      name: props.name || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({ errors: {}, name: nextProps.name });
    }
  }

  setName = e => {
    if (e) {
      this.setState({ errors: {}, name: e.target.value });
    }
  };

  handleSubmit = async ev => {
    ev.preventDefault();
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
      await this.props.subscribe(token.id);
    } catch (e) {
      reportError(e);

      return this.setState({
        loading: false,
        errors: {
          stripe: e.message,
        },
      });
    }

    return this.setState({
      loading: false,
    });
  };

  render() {
    const { buttonName, loadingText, isLoading, error } = this.props;
    const { errors, loading: stateLoading } = this.state;

    const loading = isLoading || stateLoading;

    const stripeError = errors.stripe || error;

    return (
      <form onSubmit={this.handleSubmit}>
        <Label>Cardholder Name</Label>
        {errors.name != null && <ErrorText>{errors.name}</ErrorText>}
        <div>
          <NameInput
            value={this.state.name}
            onChange={this.setName}
            error={errors.name}
            placeholder="Please enter your name"
          />
        </div>

        <Label>Card</Label>
        {stripeError != null && <ErrorText>{stripeError}</ErrorText>}
        <CardContainer>
          <CardElement
            style={{ base: { color: 'white', fontWeight: '500' } }}
          />
        </CardContainer>

        <Button
          type="submit"
          disabled={loading}
          css={`
            margin-top: 1rem;
            width: 300px;
          `}
        >
          {loading ? loadingText : buttonName}
        </Button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
