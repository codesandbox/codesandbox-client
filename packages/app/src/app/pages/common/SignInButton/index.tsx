import { Button, Stack, Text } from '@codesandbox/components';
import React, { ComponentProps, FunctionComponent } from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { useActions } from 'app/overmind';

type Props = Omit<ComponentProps<typeof Button>, 'onClick' | 'small'> & {
  redirectTo?: string;
};
export const SignInButton: FunctionComponent<Props> = props => {
  const { signInWithRedirectClicked } = useActions();
  return (
    <Button
      {...props}
      onClick={() => signInWithRedirectClicked(props.redirectTo)}
      autoWidth
    >
      <Stack align="center" gap={2}>
        <GithubIcon />{' '}
        <Text style={{ lineHeight: 1 }}>Sign in with GitHub</Text>
      </Stack>
    </Button>
  );
};
