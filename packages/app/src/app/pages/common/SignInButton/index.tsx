import * as React from 'react';
import { connect } from 'app/fluent';

import GithubIcon from 'react-icons/lib/go/mark-github';
import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

export default connect()
  .with(({ signals }) => ({
    signInClicked: signals.signInClicked
  }))
  .to(
    function SignInButton({ signInClicked }) {
      return (
        <Button
          small
          onClick={() => {
            signInClicked();
          }}
        >
          <Row>
            <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
          </Row>
        </Button>
      );
    }
  )
