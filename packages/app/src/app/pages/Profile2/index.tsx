/**
 * TODO:
 * - Page number in url
 * - Filter out unlisted and private from API response
 * - Get more sandboxes than required to fill All Sandboxes (or filter featured)
 * - Custom drag preview
 * - Sandbox picker
 * - Drag sandbox to get top showcase
 * - Add open sandbox to top showcase
 * - Remove default showcase from API?
 */

import React from 'react';
import { useOvermind } from 'app/overmind';
import { ThemeProvider, Stack, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { ALT } from '@codesandbox/common/lib/utils/keycodes';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';
import { ShowcaseSandbox } from './ShowcaseSandbox';
import { PinnedSandboxes } from './PinnedSandboxes';
import { AllSandboxes } from './AllSandboxes';
import { SearchedSandboxes } from './SearchedSandboxes';
import { LikedSandboxes } from './LikedSandboxes';
import { ContextMenu } from './ContextMenu';

export const Profile = props => {
  const { username } = props.match.params;

  const {
    actions: {
      profile: { profileMounted }
    },
    state: {
      profile: { current: user }
    }
  } = useOvermind();

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  const [menuVisible, setMenuVisibility] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: null, y: null });
  const [selectedSandboxId, selectSandboxId] = React.useState(null);

  const onContextMenu = (event, sandboxId) => {
    event.preventDefault();
    selectSandboxId(sandboxId);
    setMenuVisibility(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const onKeyDown = (event, sandboxId) => {
    if (event.keyCode !== ALT) return;
    selectSandboxId(sandboxId);
    setMenuVisibility(true);
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({ x: rect.right, y: rect.bottom });
  };

  if (!user) return null;

  return (
    <ThemeProvider>
      <Router basename={`/u2/${user.username}`}>
        <Stack
          direction="vertical"
          gap={104}
          css={css({
            height: '100%',
            width: '100vw',
            backgroundColor: 'grays.900',
            color: 'white',
            fontFamily: 'Inter, sans-serif'
          })}
        >
          <Header />

          <Stack
            gap={8}
            css={css({
              flexDirection: ['column', 'row'],
              marginX: [32, 64]
            })}
          >
            <Element css={css({ width: ['100%', '320px'] })}>
              <ProfileCard />
            </Element>
            <Element css={css({ width: ['100%', 'calc(100% - 320px)'] })}>
              <Switch>
                <Route path="/likes">
                  <LikedSandboxes menuControls={{ onContextMenu, onKeyDown }} />
                </Route>
                <Route path="/search">
                  <SearchedSandboxes
                    menuControls={{ onContextMenu, onKeyDown }}
                  />
                </Route>
                <Route path="/">
                  <DndProvider backend={Backend}>
                    <Stack direction="vertical" gap={14} css={{ flexGrow: 1 }}>
                      <ShowcaseSandbox />
                      <PinnedSandboxes
                        menuControls={{ onContextMenu, onKeyDown }}
                      />
                      <AllSandboxes
                        menuControls={{ onContextMenu, onKeyDown }}
                      />
                    </Stack>
                  </DndProvider>
                </Route>
              </Switch>
            </Element>
          </Stack>
        </Stack>
        <ContextMenu
          visible={menuVisible}
          setVisibility={setMenuVisibility}
          position={menuPosition}
          sandboxId={selectedSandboxId}
        />
      </Router>
    </ThemeProvider>
  );
};
