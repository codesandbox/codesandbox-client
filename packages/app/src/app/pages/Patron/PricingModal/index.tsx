import * as React from 'react';

import { connect, WithCerebral } from 'app/fluent';

import PricingInfo from './PricingInfo';
import PricingChoice from './PricingChoice';
import Badge from './Badge';

import { Container, Details } from './elements';

type Props = WithCerebral;

const PricingModal: React.SFC<Props> = ({ store }) => {
    const badge = `patron-${store.patron.tier}`;

    return (
        <Container>
            <Badge subscribed={store.isPatron} badge={badge} />
            <Details>
                <PricingInfo />
                <PricingChoice badge={badge} />
            </Details>
        </Container>
    );
};

export default connect<Props>()(PricingModal);
