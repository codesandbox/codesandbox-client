import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, Element } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { Step } from 'app/overmind/namespaces/pro/types';
import { Navigation } from 'app/pages/common/Navigation';

import { WorkspacePlanSelection } from './legacy-pages/WorkspacePlanSelection';
import { InlineCheckout } from './legacy-pages/InlineCheckout';
import { ConfirmBillingInterval } from './legacy-pages/ConfirmBillingInterval';
import { PaymentSuccess } from './legacy-pages/PaymentSuccess';

export const ProLegacy: React.FC = () => {
  const { pageMounted } = useActions().pro;

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  return (
    <ThemeProvider>
      <Helmet>
        <title>Pro - CodeSandbox</title>
      </Helmet>
      <Element
        css={{
          backgroundColor: '#0E0E0E',
          color: '#E5E5E5',
          width: '100%',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Navigation showActions={false} />

        <Element css={{ height: '48px' }} />

        <Switch>
          <Route path={'/pro/success'}>
            <PaymentSuccess />
          </Route>
          <Route path={`/pro`}>
            <ModifySubscription />
          </Route>
        </Switch>
      </Element>
    </ThemeProvider>
  );
};

const ModifySubscription = () => {
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
    <div>
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
    </div>
  );
};
