import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import { Container } from './elements';

type Props = WithCerebral;

const ConnectionNotice: React.SFC<Props> = ({ store }) => {
    return (
        !store.connected && (
            <Container>
                You{"'"}re not connected to the internet. You can still edit, but you cannot save. We recommend using
                the {"'"}Download{"'"} function to keep your changes.
            </Container>
        )
    );
};

export default connect<Props>()(ConnectionNotice);
