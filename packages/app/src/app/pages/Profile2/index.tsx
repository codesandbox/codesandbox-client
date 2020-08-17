import React from 'react';
import { useOvermind } from 'app/overmind';
import { ThemeProvider, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';
import { ShowcaseSandbox } from './ShowcaseSandbox';
import { PinnedSandboxes } from './PinnedSandboxes';
import { AllSandboxes } from './AllSandboxes';

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
          <DndProvider backend={Backend}>
            <Stack direction="vertical" gap={10} css={{ flexGrow: 1 }}>
              <ShowcaseSandbox />
              <PinnedSandboxes />
              <AllSandboxes />
            </Stack>
          </DndProvider>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
