import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { ComponentProps, FunctionComponent } from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';

import { useOvermind } from 'app/overmind';
import history from 'app/utils/history';

type Props = Omit<ComponentProps<typeof Button>, 'onClick' | 'small'> & {
  redirectTo?: string;
};
export const SignInButton: FunctionComponent<Props> = props => {
  const {
    actions: { signInClicked },
  } = useOvermind();

  const handleSignIn = async () => {
    await signInClicked({ useExtraScopes: false });
    if (props.redirectTo) {
      history.push(props.redirectTo.replace(location.origin, ''));
    }
  };

  return (
    <Button {...props} onClick={handleSignIn} small>
      <Row>
        <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
      </Row>
    </Button>
  );
};
