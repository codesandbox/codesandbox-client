import { Button } from '@codesandbox/common/es/components/Button';
import Row from '@codesandbox/common/es/components/flex/Row';
import { useOvermind } from 'app/overmind';
import React, { ComponentProps, FunctionComponent } from 'react';
import { GoMarkGithub } from 'react-icons/go';

type Props = Omit<ComponentProps<typeof Button>, 'onClick' | 'small'> & {
  redirectTo?: string;
};
export const SignInButton: FunctionComponent<Props> = props => {
  const { actions } = useOvermind();
  return (
    <Button
      {...props}
      onClick={() => actions.signInClicked(props.redirectTo)}
      small
    >
      <Row>
        <GoMarkGithub style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
      </Row>
    </Button>
  );
};
