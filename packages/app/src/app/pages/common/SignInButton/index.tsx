import { Button, Stack, Text } from '@codesandbox/components';
import React, { ComponentProps, FunctionComponent } from 'react';
import GithubIcon from 'react-icons/lib/go/mark-github';
import { useOvermind } from 'app/overmind';

type Props = Omit<ComponentProps<typeof Button>, 'onClick' | 'small'> & {
  redirectTo?: string;
};
export const SignInButton: FunctionComponent<Props> = props => {
  const { actions } = useOvermind();
  return (
    <Button
      {...props}
      onClick={() => actions.signInClicked(props.redirectTo)}
      autoWidth
    >
      <Stack gap={2}>
        <GithubIcon /> <Text>Sign in with GitHub</Text>
      </Stack>
    </Button>
  );
};
