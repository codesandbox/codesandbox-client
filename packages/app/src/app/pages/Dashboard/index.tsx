import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Media from 'react-media';
import Backend from 'react-dnd-html5-backend';
import { useAppState, useActions, useEffects } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  SkipNav,
} from '@codesandbox/components';
import { createGlobalStyle, useTheme } from 'styled-components';
import css from '@styled-system/css';
import Modal from 'app/components/Modal';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SIDEBAR_WIDTH } from './Sidebar/constants';
import { Content } from './Content';
import { WhatsNew } from './Components/WhatsNew/WhatsNew';
import { NUOCT22 } from '../SignIn/Onboarding';

const GlobalStyles = createGlobalStyle({
  body: { overflow: 'hidden' },
});

const COLUMN_MEDIA_THRESHOLD = 1600;
const WNOCT22 = 'WNOCT22'; // = whats new oct 22

export const Dashboard: FunctionComponent = () => {
  const { hasLogIn, modals } = useAppState();
  const actions = useActions();
  const { browser } = useEffects();

  // only used for mobile
  const [sidebarVisible, setSidebarVisibility] = React.useState(false);
  const onSidebarToggle = React.useCallback(
    () => setSidebarVisibility(s => !s),
    [setSidebarVisibility]
  );
  const theme = useTheme() as any;

  useEffect(() => {
    const isNewUser = browser.storage.get(NUOCT22);

    if (isNewUser) {
      // Open the create team modal for newly signed up users
      actions.openCreateTeamModal();

      // Remove the new user flag
      browser.storage.remove(NUOCT22);
      // Dismiss the whats new flag
      browser.storage.set(WNOCT22, true);
    } else {
      const isWhatsNewModalDismissed = browser.storage.get(WNOCT22);

      if (!isWhatsNewModalDismissed && !modals.whatsNew.isCurrent) {
        // For existing users we show the whats new modal
        actions.modals.whatsNew.open();
      }
    }
  }, [browser.storage, modals.whatsNew.isCurrent, actions]);

  const handleWhatsNewModalClose = () => {
    browser.storage.set(WNOCT22, true);
    actions.modals.whatsNew.close();
  };

  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('workspace')) {
      actions.setActiveTeam({ id: searchParams.get('workspace') });
    }
  }, [location.search, actions]);

  if (!hasLogIn) {
    return <Redirect to={signInPageUrl(location.pathname)} />;
  }

  return (
    <ThemeProvider>
      <GlobalStyles />

      <Modal
        isOpen={modals.whatsNew.isCurrent}
        onClose={handleWhatsNewModalClose}
        width={window.outerWidth > COLUMN_MEDIA_THRESHOLD ? 1200 : 950}
        fullWidth={window.screen.availWidth < 800}
      >
        <WhatsNew onClose={handleWhatsNewModalClose} />
      </Modal>

      <DndProvider backend={Backend}>
        <Stack
          direction="vertical"
          css={css({
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'sideBar.background',
            color: 'sideBar.foreground',
            width: '100vw',
            minHeight: '100vh',
          })}
        >
          <SkipNav.Link />
          <Header onSidebarToggle={onSidebarToggle} />
          <Stack css={{ flexGrow: 1 }}>
            <Media
              query={theme.media
                .lessThan(theme.sizes.medium)
                .replace('@media ', '')}
            >
              {match =>
                match ? (
                  <Sidebar
                    id="mobile-sidebar"
                    css={css({ display: ['block', 'block', 'none'] })}
                    visible={sidebarVisible}
                    onSidebarToggle={onSidebarToggle}
                    style={{
                      // We set sidebar as absolute so that content can
                      // take 100% width, this helps us enable dragging
                      // sandboxes onto the sidebar more freely.
                      position: 'absolute',
                      height: 'calc(100% - 48px)',
                    }}
                  />
                ) : (
                  <Element
                    id="desktop-sidebar"
                    css={css({ display: ['none', 'none', 'block'] })}
                  >
                    <Sidebar
                      visible
                      onSidebarToggle={() => {
                        /* do nothing */
                      }}
                      style={{
                        // We set sidebar as absolute so that content can
                        // take 100% width, this helps us enable dragging
                        // sandboxes onto the sidebar more freely.
                        position: 'absolute',
                        height: 'calc(100% - 48px)',
                      }}
                    />
                  </Element>
                )
              }
            </Media>

            <Element
              as="main"
              css={css({
                width: '100%',
                height: 'calc(100vh - 48px)',
                paddingLeft: [0, 0, SIDEBAR_WIDTH + 24],
              })}
            >
              <Content />
            </Element>
          </Stack>
        </Stack>
      </DndProvider>
    </ThemeProvider>
  );
};
