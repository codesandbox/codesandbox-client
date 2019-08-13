import * as React from 'react';
import { inject, observer } from 'app/componentConnectors';

import GithubIcon from 'react-icons/lib/go/mark-github';
import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';

const SignInButton = (props: any) => {
  const { signInClicked } = props.signals;

  return (
    <Button small onClick={signInClicked} {...props}>
      <Row>
        <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
      </Row>
    </Button>
  );
};

export default inject('signals')(observer(SignInButton));
