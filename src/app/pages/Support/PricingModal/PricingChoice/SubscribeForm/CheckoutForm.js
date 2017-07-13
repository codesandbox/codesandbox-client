import React from 'react';
import styled from 'styled-components';

import { CardElement } from 'react-stripe-elements';

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
  font-size: .875rem;
  padding: .5rem;
  margin-top: 0.25rem;
  margin-bottom: .5rem;
  height: 32.8px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.5);
  font-size: .875rem;
`;

type Props = {
  name: ?string,
  stripe: {
    createToken: (params: ?Object) => Promise<{ token: string }>,
  },
};

type State = {
  name: string,
};

export default class CheckoutForm extends React.PureComponent {
  props: Props;
  state: State;
  constructor(props: Props) {
    super(props);

    this.state = {
      name: props.name || '',
    };
  }
  setName = e => {
    if (e) {
      this.setState({ name: e.target.value });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    e.persist();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe
      .createToken({ name: this.props.name })
      .then(({ token }) => {
        console.log('Received Stripe token:', token);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Label>Full Name</Label>
        <div>
          <NameInput
            value={this.props.name}
            onChange={this.setName}
            placeholder="Enter your name"
          />
        </div>

        <Label>Card</Label>
        <CardContainer>
          <CardElement style={{ base: { color: 'white', fontWeight: 300 } }} />
        </CardContainer>

        <Button type="submit" style={{ marginTop: '1rem', width: 300 }}>
          Subscribe
        </Button>
      </form>
    );
  }
}
