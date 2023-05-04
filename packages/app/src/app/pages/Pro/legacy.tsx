import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { Step } from 'app/overmind/namespaces/pro/types';
import { Navigation } from 'app/pages/common/Navigation';

import { WorkspacePlanSelection } from './legacy-pages/WorkspacePlanSelection';
import { InlineCheckout } from './legacy-pages/InlineCheckout';
import { ConfirmBillingInterval } from './legacy-pages/ConfirmBillingInterval';
import { PaymentSuccess } from './legacy-pages/PaymentSuccess';
import { SignInModalElement } from '../SignIn/Modal';

export const ProLegacy: React.FC = () => {
  const { pageMounted } = useActions().pro;
  const { hasLoadedApp, isLoggedIn } = useAppState();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  const getContent = () => {
    if (!hasLoadedApp) return null;
    if (!isLoggedIn) {
      return (
        <div style={{ marginTop: 120 }}>
          <SignInModalElement />
        </div>
      );
    }

    return (
      <Switch>
        <Route path={'/pro/success'}>
          <PaymentSuccess />
        </Route>
        <Route path={`/pro`}>
          <StartOrModifySubscription />
        </Route>
      </Switch>
    );
  };

  return (
    <ThemeProvider>
      <Helmet>
        <title>Pro - CodeSandbox</title>
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Stack
        direction="vertical"
        css={css({
          backgroundColor: 'grays.900',
          color: 'white',
          width: '100vw',
          minHeight: '100vh',
          fontFamily: 'Lato, sans-serif',
        })}
      >
        <Navigation title="CodeSandbox Pro" />
        {getContent()}
      </Stack>
    </ThemeProvider>
  );
};

const StartOrModifySubscription = () => {
  /**
   * The user flow forks based on the account.
   *
   * step 1 - choose account (personal or team) and plan
   * step 2 -
   *    if subscription doesn't exist - Inline Checkout
   *    if subscription already exists - Confirm Amount Change
   * step 3 - redirect to pro/success
   *
   * We don't treat these as separate pages because steps transition into
   * each other with data from the previous step
   */

  const {
    step,
    isPaddleInitialised,
    isBillingAmountLoaded,
  } = useAppState().pro;

  return (
    <Stack
      justify="center"
      align="center"
      css={css({ fontSize: 3, width: 560, marginTop: 120, marginX: 'auto' })}
    >
      {step === Step.WorkspacePlanSelection ||
      (step === Step.InlineCheckout && !isPaddleInitialised) ||
      (step === Step.ConfirmBillingInterval && !isBillingAmountLoaded) ? (
        <WorkspacePlanSelection
          loading={
            (step === Step.InlineCheckout && !isPaddleInitialised) ||
            (step === Step.ConfirmBillingInterval && !isBillingAmountLoaded)
          }
        />
      ) : null}
      {step === Step.InlineCheckout && (
        <div
          style={{
            width: isPaddleInitialised ? 'auto' : 0,
            height: isPaddleInitialised ? 'auto' : 0,
            overflow: 'hidden',
          }}
        >
          <InlineCheckout />
        </div>
      )}
      {step === Step.ConfirmBillingInterval && <ConfirmBillingInterval />}
    </Stack>
  );
};
