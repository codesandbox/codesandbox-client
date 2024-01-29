import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent, useEffect } from 'react';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import Media from 'react-media';
import Backend from 'react-dnd-html5-backend';
import { useAppState, useActions } from 'app/overmind';
import {
  ThemeProvider,
  Stack,
  Element,
  SkipNav,
} from '@codesandbox/components';
import { createGlobalStyle, useTheme } from 'styled-components';
import css from '@styled-system/css';

import { PaymentPending } from 'app/components/StripeMessages';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { SubscriptionStatus } from 'app/graphql/types';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { UsageLimitMessageStripe } from 'app/components/StripeMessages/UsageLimitMessageStripe';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SIDEBAR_WIDTH } from './Sidebar/constants';
import { Content } from './Content';
import { NewTeamModal } from './Components/NewTeamModal';

const GlobalStyles = createGlobalStyle({
  body: { overflow: 'hidden' },
});

// TODO: Move this page to v2 (also, this is a random commit to trigger the re-run of the build)
export const Dashboard: FunctionComponent = () => {
  const location = useLocation();
  const history = useHistory();

  const { hasLogIn } = useAppState();
  const actions = useActions();
  const { subscription } = useWorkspaceSubscription();
  const { showUsageLimitBanner } = useWorkspaceLimits();
  const { trackVisit } = useDashboardVisit();

  // only used for mobile
  const [sidebarVisible, setSidebarVisibility] = React.useState(false);
  const onSidebarToggle = React.useCallback(
    () => setSidebarVisibility(s => !s),
    [setSidebarVisibility]
  );
  const theme = useTheme() as any;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get('workspace')) {
      // Change workspace based on workspace param

      // TODO: We might want to update this because this is also triggered in
      // overmind already? We can check if it is triggered multiple times.
      actions.setActiveTeam({ id: searchParams.get('workspace') });
    }
  }, [subscription]);

  const hasUnpaidSubscription =
    subscription?.status === SubscriptionStatus.Unpaid;
  const hasTopBarBanner = hasUnpaidSubscription || showUsageLimitBanner;

  useEffect(() => {
    if (!hasLogIn) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);

    if (JSON.parse(searchParams.get('import_repo'))) {
      actions.modalOpened({ modal: 'importRepository' });
    } else if (JSON.parse(searchParams.get('create_sandbox'))) {
      actions.modalOpened({ modal: 'createSandbox' });
    } else if (JSON.parse(searchParams.get('create_devbox'))) {
      actions.modalOpened({ modal: 'createDevbox' });
    } else if (searchParams.get('preferences')) {
      const toToOpen = searchParams.get('preferences');
      actions.preferences.openPreferencesModal(toToOpen);
    }

    history.replace({ search: searchParams.toString() });
  }, [actions, hasLogIn, location.search]);

  useEffect(() => {
    trackVisit();
  }, []);

  if (!hasLogIn) {
    return (
      <Redirect to={signInPageUrl(`${location.pathname}${location.search}`)} />
    );
  }

  return (
    <ThemeProvider>
      <GlobalStyles />

      <DndProvider backend={Backend}>
        <Stack
          direction="vertical"
          css={css({
            position: 'relative',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'sideBar.background',
            color: 'sideBar.foreground',
            width: '100%',
            height: '100%',
          })}
        >
          <SkipNav.Link />
          {hasUnpaidSubscription && <PaymentPending />}
          {showUsageLimitBanner && <UsageLimitMessageStripe />}
          <Header onSidebarToggle={onSidebarToggle} />
          <Media
            query={theme.media
              .lessThan(theme.sizes.medium)
              .replace('@media ', '')}
          >
            {match =>
              match ? (
                <Element
                  id="mobile-sidebar"
                  css={css({ display: ['block', 'block', 'none'] })}
                >
                  <Sidebar
                    visible={sidebarVisible}
                    hasTopBarBanner={hasTopBarBanner}
                    onSidebarToggle={onSidebarToggle}
                  />
                </Element>
              ) : (
                <Element
                  id="desktop-sidebar"
                  css={css({
                    display: ['none', 'none', 'block'],
                  })}
                >
                  <Sidebar
                    visible
                    hasTopBarBanner={hasTopBarBanner}
                    onSidebarToggle={() => {
                      /* do nothing */
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
              // 100vh - (topbar height - gap between topbar and content) - (banner height or 0)
              height: `calc(100vh - 32px - ${hasTopBarBanner ? '44' : '0'}px)`,
              paddingLeft: [0, 0, SIDEBAR_WIDTH + 24],
            })}
          >
            <Content />
          </Element>
        </Stack>
      </DndProvider>
      <NewTeamModal />
    </ThemeProvider>
  );
};
