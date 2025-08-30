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

import { PaymentPending } from 'app/components/StripeMessages/PaymentPending';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { SubscriptionStatus } from 'app/graphql/types';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { UsageLimitMessageStripe } from 'app/components/StripeMessages/UsageLimitMessageStripe';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SIDEBAR_WIDTH } from './Sidebar/constants';
import { Content } from './Content';

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

  const hasPaymentProblems =
    subscription?.status === SubscriptionStatus.Unpaid ||
    subscription?.status === SubscriptionStatus.Incomplete;

  const hasTopBarBanner = showUsageLimitBanner || hasPaymentProblems;

  useEffect(() => {
    if (!hasLogIn) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get('import_repo')) {
      const [owner, name] = searchParams.get('import_repo').split('/');
      actions.modalOpened({
        modal: 'import',
        repoToImport: owner && name ? { owner, name } : undefined,
      });
      searchParams.delete('import_repo');
    } else if (searchParams.get('create_sandbox')) {
      const sandboxId = searchParams.get('create_sandbox');
      actions.modalOpened({
        modal: 'create',
        sandboxIdToFork:
          !!sandboxId && sandboxId !== 'true' ? sandboxId : undefined,
      });
      searchParams.delete('create_sandbox');
    } else if (searchParams.get('create_devbox')) {
      const sandboxId = searchParams.get('create_devbox');
      actions.modalOpened({
        modal: 'create',
        sandboxIdToFork:
          !!sandboxId && sandboxId !== 'true' ? sandboxId : undefined,
      });
      searchParams.delete('create_devbox');
    } else if (JSON.parse(searchParams.get('create'))) {
      actions.modalOpened({ modal: 'create' });
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
          {hasPaymentProblems && (
            <PaymentPending status={subscription?.status} />
          )}
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
              paddingLeft: [0, 0, SIDEBAR_WIDTH + 8],
            })}
          >
            <Content />
          </Element>
        </Stack>
      </DndProvider>
    </ThemeProvider>
  );
};
