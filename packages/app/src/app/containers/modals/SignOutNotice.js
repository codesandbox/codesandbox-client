import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/buttons/Button';
import Row from 'common/components/flex/Row';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

const Heading = styled.h2`
  margin-top: 0;
`;

const Explanation = styled.p`
  line-height: 1.3;
  margin-bottom: 2rem;
`;

function SignOutNotice({ signals }) {
  return (
    <Container>
      <Heading>You have been signed out</Heading>
      <Explanation>
        CodeSandbox has migrated to a system where authorization tokens can be
        managed and revoked, and we had to sign everyone out for this.
        <br />
        <br />But don{"'"}t worry, you can sign in right again!
      </Explanation>

      <Row justifyContent="space-around">
        <Button
          block
          style={{ marginRight: '.5rem' }}
          red
          onClick={() => {
            signals.closeModal();
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
}

export default inject('store', 'signals')(observer(SignOutNotice));
