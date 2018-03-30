import * as React from 'react';
import { connect } from 'app/fluent';
import * as moment from 'moment';

import Centered from 'common/components/flex/Centered';
import Relative from 'common/components/Relative';
import SubscribeForm from 'app/components/SubscribeForm';
import badges from 'common/utils/badges/patron-info';

import Range from './Range';
import ChangeSubscription from './ChangeSubscription';
import ThankYou from './ThankYou';
import { Title } from '../elements';
import { Container, PriceInput, Month, Currency, Notice, RangeContainer, StyledSignInButton } from './elements';

type Props = {
    badge: string;
};

export default connect<Props>()
    .with(({ state, signals }) => ({
        ...state.patron,
        isPatron: state.isPatron,
        userName: state.user.name,
        isLoggedIn: state.isLoggedIn,
        subscription: { ...state.user.subscription },
        signals: { ...signals.patron }
    }))
    .to(function PricingChoice({
        error,
        userName,
        isPatron,
        isLoggedIn,
        subscription,
        price,
        isUpdatingSubscription,
        signals,
        badge
    }) {
        return (
            <Container>
                <Centered horizontal vertical={false}>
                    <Title>Pay what you want</Title>
                    {isPatron && <ThankYou price={subscription.amount} color={badges[badge].colors[0]} />}
                    <Relative>
                        <Currency>$</Currency>
                        <PriceInput
                            onChange={(event) => signals.priceChanged({ price: Number(event.target.value) })}
                            value={price}
                            type="number"
                        />
                        <Month>/month</Month>
                    </Relative>
                    <RangeContainer>
                        <Range
                            onChange={(value) => signals.priceChanged({ price: Number(value) })}
                            min={5}
                            max={50}
                            step={1}
                            value={price}
                            color={badges[badge].colors[0]}
                        />
                    </RangeContainer>
                    {isLoggedIn ? isPatron ? ( // eslint-disable-line no-nested-ternary
                        <ChangeSubscription />
                    ) : (
                        <Centered style={{ marginTop: '2rem' }} horizontal>
                            <SubscribeForm
                                subscribe={(token) => signals.createSubscriptionClicked({ token })}
                                isLoading={isUpdatingSubscription}
                                name={userName}
                                error={error}
                            />
                            <Notice>
                                You will be billed now and on the{' '}
                                <strong style={{ color: 'white' }}>{moment().format('Do')}</strong> of each month
                                thereafter. You can cancel or change your subscription at any time.
                            </Notice>
                        </Centered>
                    ) : (
                        <StyledSignInButton />
                    )}
                </Centered>
            </Container>
        );
    });
