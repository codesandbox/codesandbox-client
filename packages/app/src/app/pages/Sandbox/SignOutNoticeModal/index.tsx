import * as React from 'react';
import { connect } from 'app/fluent';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

export default connect()
  .with(({ signals }) => ({
    closeModal: signals.closeModal,
    signInClicked: signals.signInClicked
  }))
  .to(
    function SignOutNotice({ closeModal, signInClicked }) {
      return (
        <Container>
          <Heading>You have been signed out</Heading>
          <Explanation>
            CodeSandbox has migrated to a system where authorization tokens can be
            managed and revoked, and we had to sign everyone out for this.
            <br />
            <br />But don{'\''}t worry, you can sign in right again!
          </Explanation>

          <Row justifyContent="space-around">
            <Button
              block
              style={{ marginRight: '.5rem' }}
              red
              onClick={() => {
                closeModal();
              }}
            >
              Close
            </Button>
            <Button
              block
              style={{ marginLeft: '.5rem' }}
              onClick={() => signInClicked({ useExtraScopes: false })}
            >
              Sign in
            </Button>
          </Row>
        </Container>
      );
    }
  )
