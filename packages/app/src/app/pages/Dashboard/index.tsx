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
import { differenceInDays, startOfToday } from 'date-fns';

import {
  PaymentPending,
  TrialWithoutPaymentInfo,
  PaymentProcessing,
} from 'app/components/StripeMessages';
import { useShowBanner } from 'app/components/StripeMessages/TrialWithoutPaymentInfo';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { SubscriptionStatus } from 'app/graphql/types';
import { useDismissible } from 'app/hooks';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SIDEBAR_WIDTH } from './Sidebar/constants';
import { Content } from './Content';
import { NUOCT22 } from '../SignIn/Onboarding';
import { NewTeamModal } from './Components/NewTeamModal';

const GlobalStyles = createGlobalStyle({
  body: { overflow: 'hidden' },
});

// TODO: Move this page to v2 (also, this is a random commit to trigger the re-run of the build)
export const Dashboard: FunctionComponent = () => {
  const {
    hasLogIn,
    activeTeamInfo,
    activeTeam,
    isProcessingPayment,
  } = useAppState();
  const { browser, notificationToast } = useEffects();
  const actions = useActions();
  const {
    subscription,
    hasActiveTeamTrial,
    hasPaymentMethod,
  } = useWorkspaceSubscription();
  const { trackVisit } = useDashboardVisit();
  const [
    showTrialWithoutPaymentInfoBanner,
    dismissTrialWithoutPaymentInfoBanner,
  ] = useShowBanner();
  const [isMidTrialReminderDismissed] = useDismissible(
    `DASHBOARD_MID_TRIAL_REMINDER_${activeTeam}`
  );
  const { isTeamAdmin } = useWorkspaceAuthorization();

  // only used for mobile
  const [sidebarVisible, setSidebarVisibility] = React.useState(false);
  const onSidebarToggle = React.useCallback(
    () => setSidebarVisibility(s => !s),
    [setSidebarVisibility]
  );
  const theme = useTheme() as any;

  useEffect(() => {
    const newUser = browser.storage.get(NUOCT22);

    if (newUser && newUser === 'signup') {
      // Open the create team modal for newly signed up users
      // not coming from a team invite page.
      actions.openCreateTeamModal();
      browser.storage.remove(NUOCT22);
    }
  }, [browser.storage, actions]);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.get('workspace')) {
      // Change workspace based on workspace param

      // TODO: We might want to update this because this is also triggered in
      // overmind already? We can check if it is triggered multiple times.
      actions.setActiveTeam({ id: searchParams.get('workspace') });
    }

    if (
      activeTeamInfo &&
      searchParams.get('stripe') &&
      searchParams.get('stripe') === 'success'
    ) {
      // Successful return from stripe, but payment not processed yet
      const isProDelayed = activeTeamInfo.subscription === null;
      actions.setIProcessingPayment(isProDelayed);
    }
  }, [location.search, actions, activeTeamInfo, notificationToast]);

  const hasUnpaidSubscription =
    subscription?.status === SubscriptionStatus.Unpaid;
  const hasTopBarBanner =
    showTrialWithoutPaymentInfoBanner || hasUnpaidSubscription;

  useEffect(() => {
    if (!hasLogIn) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);

    if (JSON.parse(searchParams.get('create_team'))) {
      actions.openCreateTeamModal();
    } else if (JSON.parse(searchParams.get('import_repo'))) {
      actions.openCreateSandboxModal({ initialTab: 'import' });
    } else if (JSON.parse(searchParams.get('create_sandbox'))) {
      actions.openCreateSandboxModal();
    } else if (JSON.parse(searchParams.get('preferences'))) {
      actions.preferences.openPreferencesModal();
    }
  }, [actions, hasLogIn, location.search]);

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    if (
      isTeamAdmin &&
      hasActiveTeamTrial &&
      hasPaymentMethod === false &&
      subscription.trialEnd &&
      !isMidTrialReminderDismissed
    ) {
      const today = startOfToday();
      const trialEndDate = new Date(subscription.trialEnd);
      const remainingTrialDays = differenceInDays(trialEndDate, today);

      if (remainingTrialDays <= 7) {
        actions.modalOpened({ modal: 'midTrial' });
      }
    }
  }, [
    isTeamAdmin,
    actions,
    hasActiveTeamTrial,
    hasPaymentMethod,
    isMidTrialReminderDismissed,
    subscription,
  ]);

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
          {isProcessingPayment && <PaymentProcessing />}
          {hasUnpaidSubscription && <PaymentPending />}
          {showTrialWithoutPaymentInfoBanner && (
            <TrialWithoutPaymentInfo
              onDismiss={dismissTrialWithoutPaymentInfoBanner}
            />
          )}
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
