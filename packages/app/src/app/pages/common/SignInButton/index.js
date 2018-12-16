import * as React from 'react';
import { inject, observer } from 'mobx-react';

import GithubIcon from 'react-icons/lib/go/mark-github';
import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

function SignInButton(props) {
  const { signals } = props;

  return (
    <Button
      small
      onClick={() => {
        signals.signInClicked();
      }}
      {...props}
    >
      <Row>
        <GithubIcon
          css={`
            margin-right: 0.5rem;
          `}
        />{' '}
        Sign in with GitHub
      </Row>
    </Button>
  );
}

export default inject('store', 'signals')(observer(SignInButton));
