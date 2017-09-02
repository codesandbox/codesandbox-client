import React from 'react';
import styled from 'styled-components';

import { injectStripe, CardElement } from 'react-stripe-elements';

import Input from 'app/components/Input';
import Button from 'app/components/buttons/Button';

const CardContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 4px;
`;

const NameInput = styled(Input)`
  width: 100%;
  font-size: 0.875rem;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  height: 32.8px;
`;

const ErrorText = styled.div`
  color: ${props => props.theme.red};
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

type Props = {
  name: ?string,
  buttonName: string,
  loadingText: string,
  stripe: {
    createToken: (params: ?Object) => Promise<{ token: string }>,
  },
  subscribe: (Promise<{ token: { id: string } }>) => void,
};

type State = {
  name: string,
  buttonName: string,
};

class CheckoutForm extends React.PureComponent {
  props: Props;
  state: State;

  constructor(props: Props) {
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
      name: this.props.name,
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
    const { buttonName, loadingText } = this.props;
    const { errors, loading } = this.state;

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
        {errors.stripe != null && <ErrorText>{errors.stripe}</ErrorText>}
        <CardContainer>
          <CardElement style={{ base: { color: 'white', fontWeight: 300 } }} />
        </CardContainer>

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

export default injectStripe(CheckoutForm);
