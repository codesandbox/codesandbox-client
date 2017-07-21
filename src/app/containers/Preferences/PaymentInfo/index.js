import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import userActionCreators from 'app/store/user/actions';
import SubscribeForm from 'app/components/user/SubscribeForm';

import Card from './Card';
import Title from '../MenuTitle';

const Container = styled.div`
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
`;

const Subheading = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin: 1rem 0;
  text-transform: uppercase;
`;

type Props = {
  userActions: typeof userActionCreators,
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class PaymentInfo extends React.PureComponent {
  props: Props;
  state = {
    loading: true,
    data: null,
  };

  componentDidMount() {
    this.fetchPaymentDetails();
  }

  fetchPaymentDetails = async () => {
    try {
      const data = await this.props.userActions.getPaymentDetails();
      this.setState({ loading: false, data });
    } catch (e) {
      this.setState({ loading: false, error: e.message });
    }
  };

  updatePaymentDetails = async (token: string) => {
    const data = await this.props.userActions.updatePaymentDetails(token);
    this.setState({ loading: false, data });
  };

  paymentDetails = () => {
    if (this.state.error)
      return (
        <div>
          An error occurred: {this.state.error}
        </div>
      );

    const { data } = this.state;
    return (
      <div>
        <Subheading>Current card</Subheading>
        <Card last4={data.last4} name={data.name} brand={data.brand} />

        <Subheading style={{ marginTop: '2rem' }}>Update card info</Subheading>
        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={data.name}
          subscribe={this.updatePaymentDetails}
        />
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Container>
        <Title>Payment Info</Title>
        {loading
          ? <div>Loading payment details...</div>
          : this.paymentDetails()}
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(PaymentInfo);
