import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

type Props = WithCerebral;

const SignOutNotice: React.SFC<Props> = ({ signals }) => {
    return (
        <Container>
            <Heading>You have been signed out</Heading>
            <Explanation>
                CodeSandbox has migrated to a system where authorization tokens can be managed and revoked, and we had
                to sign everyone out for this.
                <br />
                <br />But don{"'"}t worry, you can sign in right again!
            </Explanation>

            <Row justifyContent="space-around">
                <Button
                    block
                    style={{ marginRight: '.5rem' }}
                    red
                    onClick={() => {
                        signals.modalClosed();
                    }}
                >
                    Close
                </Button>
                <Button
                    block
                    style={{ marginLeft: '.5rem' }}
                    onClick={() => signals.signInClicked({ useExtraScopes: false })}
                >
                    Sign in
                </Button>
            </Row>
        </Container>
    );
};

export default connect<Props>()(SignOutNotice);
