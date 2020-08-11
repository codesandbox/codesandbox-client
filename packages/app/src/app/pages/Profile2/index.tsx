import React from 'react';
import { ThemeProvider, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';

export const Profile = props => {
  const { username } = props.match.params;

  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      profile: { current: user, showcasedSandbox },
    },
  } = useOvermind();

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  if (!user) return null;

  return (
    <ThemeProvider>
      <Stack
        direction="vertical"
        gap={104}
        css={css({
          height: '100vh',
          width: '100vw',
          backgroundColor: 'grays.900',
          color: 'white',
        })}
      >
        <Header />

        <Stack marginX={64} gap={8}>
          <ProfileCard />
          {showcasedSandbox && (
            <iframe
              src={`https://codesandbox.io/embed/${showcasedSandbox.id}?fontsize=14&hidenavigation=1&theme=dark&view=preview`}
              style={{
                width: '100%',
                height: 360,
                border: 0,
                borderRadius: '4px',
                overflow: 'hidden',
              }}
              title="React"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          )}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
