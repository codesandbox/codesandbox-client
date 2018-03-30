import * as React from 'react';
import { connect } from 'app/fluent';

import SubscribeForm from 'app/components/SubscribeForm';

import Card from './Card';
import { Title, Subheading } from '../elements';
import { Container } from './elements';

export default connect()
    .with(({ state, signals }) => ({
        isLoadingPaymentDetails: state.preferences.isLoadingPaymentDetails,
        paymentDetails: state.preferences.paymentDetails,
        paymentDetailError: state.preferences.paymentDetailError,
        paymentDetailsRequested: signals.preferences.paymentDetailsRequested,
        paymentDetailsUpdated: signals.preferences.paymentDetailsUpdated
    }))
    .toClass(
        (props) =>
            class PaymentInfo extends React.Component<typeof props> {
                componentDidMount() {
                    this.props.paymentDetailsRequested();
                }

                updatePaymentDetails = (token) => {
                    this.props.paymentDetailsUpdated({ token });
                };

                paymentDetails = () => {
                    const { paymentDetails, paymentDetailError } = this.props;

                    if (paymentDetailError) {
                        return <div>An error occurred: {paymentDetailError}</div>;
                    }

                    return (
                        <div>
                            <Subheading>Current card</Subheading>
                            <Card
                                last4={paymentDetails.last4}
                                name={paymentDetails.name}
                                brand={paymentDetails.brand}
                            />

                            <Subheading style={{ marginTop: '2rem' }}>Update card info</Subheading>
                            <SubscribeForm
                                buttonName="Update"
                                loadingText="Updating Card Info..."
                                name={paymentDetails.name}
                                subscribe={this.updatePaymentDetails}
                            />
                        </div>
                    );
                };

                render() {
                    const { isLoadingPaymentDetails } = this.props;

                    return (
                        <Container>
                            <Title>Payment Info</Title>
                            {isLoadingPaymentDetails ? <div>Loading payment details...</div> : this.paymentDetails()}
                        </Container>
                    );
                }
            }
    );
