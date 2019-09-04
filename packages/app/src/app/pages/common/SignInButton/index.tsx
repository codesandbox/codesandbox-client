import * as React from 'react';
import { observer } from 'app/componentConnectors';

import GithubIcon from 'react-icons/lib/go/mark-github';
import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import { useSignals } from 'app/store';

const SignInButtonComponent = (props: any) => {
  const { signInClicked } = useSignals();

  return (
    <Button small onClick={signInClicked} {...props}>
      <Row>
        <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
      </Row>
    </Button>
  );
};

export const SignInButton = observer(SignInButtonComponent);
