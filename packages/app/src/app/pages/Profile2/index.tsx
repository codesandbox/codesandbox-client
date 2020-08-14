import React from 'react';
import { useOvermind } from 'app/overmind';
import { ThemeProvider, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { DndProvider, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';
import { AllSandboxes } from './AllSandboxes';
import { ShowcaseSandbox } from './ShowcaseSandbox';

export const Profile = props => {
  const { username } = props.match.params;

  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      user: loggedInUser,
      profile: { current: user, showcasedSandbox },
    },
  } = useOvermind();

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  if (!user) return null;

  const myProfile = loggedInUser?.username === user.username;

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
          <DndProvider backend={Backend}>
            <Stack direction="vertical" gap={10} css={{ flexGrow: 1 }}>
              {showcasedSandbox && (
                <ShowcaseSandbox sandbox={showcasedSandbox} />
              )}

              <PinnedSandboxes myProfile={myProfile} />

              <AllSandboxes />
            </Stack>
          </DndProvider>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

const PinnedSandboxes = ({ myProfile }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'sandbox',
    drop: () => ({ name: 'PINNED_SANDBOXES' }),
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });
  return myProfile ? (
    <div ref={drop}>
      <Stack
        justify="center"
        align="center"
        css={css({
          height: 180,
          padding: 4,
          backgroundColor: isOver ? 'grays.700' : 'transparent',
          transition: theme => `background-color ${theme.speeds[2]}`,
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23757575' stroke-width='1' stroke-dasharray='8%2c8' stroke-dashoffset='4' stroke-linecap='square'/%3e%3c/svg%3e");border-radius: 4px;`,
        })}
      >
        <Text variant="muted" size={4} weight="medium" align="center">
          Drag your Sandbox here to pin them to your profile
        </Text>
      </Stack>
    </div>
  ) : null;
};
