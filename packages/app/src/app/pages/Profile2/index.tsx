import React from 'react';
import { useOvermind } from 'app/overmind';
import { ThemeProvider, Element, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';
import { AllSandboxes } from './AllSandboxes';

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
          height: '100%',
          width: '100vw',
          backgroundColor: 'grays.900',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        })}
      >
        <Header />

        <Stack marginX={64} gap={8}>
          <div>
            <ProfileCard />
          </div>
          <Stack direction="vertical" gap={10} css={{ flexGrow: 1 }}>
            {showcasedSandbox && (
              <Element
                as="iframe"
                src={`https://${showcasedSandbox.id}.csb.app?standalone=1`}
                css={css({
                  backgroundColor: 'white',
                  width: '100%',
                  height: 360,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'grays.600',
                })}
                title="React"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            )}
            <AllSandboxes />
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
