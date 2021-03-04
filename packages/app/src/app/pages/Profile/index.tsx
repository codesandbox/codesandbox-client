import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { ThemeProvider, Stack, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Helmet } from 'react-helmet';
import { NotFound } from 'app/pages/common/NotFound';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';
import { ShowcaseSandbox } from './ShowcaseSandbox';
import { PinnedSandboxes } from './PinnedSandboxes';
import { AllSandboxes } from './AllSandboxes';
import { SearchedSandboxes } from './SearchedSandboxes';
import { LikedSandboxes } from './LikedSandboxes';

import { ContextMenu } from './ContextMenu';

export const Profile: React.FunctionComponent<RouteComponentProps<{
  username: string;
}>> = ({
  match: {
    params: { username },
  },
}) => {
  const { profileMounted } = useActions().profile;
  const { current: user, notFound } = useAppState().profile;

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  if (notFound) {
    return <NotFound />;
  }

  if (!user) return null;

  return (
    <ThemeProvider>
      <Stack
        direction="vertical"
        gap={104}
        css={css({
          width: '100vw',
          minHeight: '100vh',
          backgroundColor: 'grays.900',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        })}
      >
        <Helmet>
          <title>{user.name || user.username} - CodeSandbox</title>
        </Helmet>
        <Header />

        <Stack
          gap={8}
          css={css({
            flexDirection: ['column', 'row'],
            marginX: [32, 64],
          })}
        >
          <Element css={css({ width: ['100%', '320px'] })}>
            <ProfileCard />
          </Element>
          <Element css={css({ width: ['100%', 'calc(100% - 320px)'] })}>
            <Switch>
              <Route path={`/u/${user.username}/likes`}>
                <LikedSandboxes />
              </Route>
              <Route path={`/u/${user.username}/search`}>
                <SearchedSandboxes />
              </Route>
              <Route path={`/u/${user.username}`}>
                <DndProvider backend={Backend}>
                  <Stack direction="vertical" gap={14} css={{ flexGrow: 1 }}>
                    <ShowcaseSandbox />
                    <PinnedSandboxes />
                    <AllSandboxes />
                  </Stack>
                </DndProvider>
              </Route>
            </Switch>
          </Element>
        </Stack>
      </Stack>
      <ContextMenu />
    </ThemeProvider>
  );
};
