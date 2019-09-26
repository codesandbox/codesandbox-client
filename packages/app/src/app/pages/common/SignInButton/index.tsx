import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { ComponentProps, FunctionComponent } from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';

import { useOvermind } from 'app/overmind';

type Props = Omit<ComponentProps<typeof Button>, 'onClick' | 'small'>;
export const SignInButton: FunctionComponent<Props> = props => {
  const {
    actions: { signInClicked },
  } = useOvermind();

  return (
    <Button
      {...props}
      onClick={() => signInClicked({ useExtraScopes: false })}
      small
    >
      <Row>
        <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
      </Row>
    </Button>
  );
};
