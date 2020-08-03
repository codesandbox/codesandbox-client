import React from 'react';
import { ThemeProvider, Stack, Avatar } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const Profile = props => {
  const { username } = props.match.params;
  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      profile: { current: user },
    },
  } = useOvermind();

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  return (
    <ThemeProvider>
      <Stack
        css={{ height: '100vh', width: '100vw' }}
        justify="center"
        align="center"
      >
        <Avatar user={user} css={{ zoom: 2 }} />
      </Stack>
    </ThemeProvider>
  );
};
