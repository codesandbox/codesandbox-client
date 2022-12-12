import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, Element } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { Step } from 'app/overmind/namespaces/pro/types';
import { Navigation } from 'app/pages/common/Navigation';

import { WorkspacePlanSelection } from './legacy-pages/WorkspacePlanSelection';
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
          {/* TODO */}
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
  const { step } = useAppState().pro;

  /**
   * The user flow forks based on the account.
   *
   * step 1 - Choose account (personal or team) and plan
   * step 2 - Confirm Amount Change
   * step 3 - Redirect to pro/success
   *
   * We don't treat these as separate pages because steps transition into
   * each other with data from the previous step
   */

  if (step === Step.WorkspacePlanSelection) {
    return <WorkspacePlanSelection />;
  }

  if (step === Step.ConfirmBillingInterval) {
    return <ConfirmBillingInterval />;
  }

  return null;
};
