import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { NewTeam } from 'app/pages/common/NewTeam';
import { WorkspacePlanSelection } from './pages/WorkspacePlanSelection';
import { InlineCheckout } from './pages/InlineCheckout';
import { ConfirmBillingInterval } from './pages/ConfirmBillingInterval';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { Plan } from './plans';

export const ProPage: React.FC = () => (
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

      <Switch>
        <Route path={`/pro/create-workspace`}>
          <NewTeam redirectTo="/pro?v=2" />;
        </Route>
        <Route path={'/pro/success'}>
          <PaymentSuccess />
        </Route>
        <Route path={`/pro`}>
          <StartOrModifySubscription />
        </Route>
      </Switch>
    </Stack>
  </ThemeProvider>
);

const StartOrModifySubscription = () => {
  /**
   * The user flow forks based on the workspace
   *
   * step 1 - choose workspace and plan
   * step 2 -
   *    if subscription doens't exist - Inline Checkout
   *    if subscription already exists - Confirm Amount Change
   * step 3 - redirect to pro/success
   *
   * We don't treat these as seperate pages because steps transition into
   * each other with data from the previous step
   */

  const {
    state: {
      pro: { step, seats, isPaddleInitialised, isBillingAmountLoaded },
    },
  } = useOvermind();

  const [selectedPlan, setPlan] = React.useState<Plan>(null);

  return (
    <Stack
      justify="center"
      align="center"
      css={css({ fontSize: 3, width: 560, marginTop: 120, marginX: 'auto' })}
    >
      {step === 'WorkspacePlanSelection' ||
      (step === 'InlineCheckout' && !isPaddleInitialised) ||
      (step === 'ConfirmBillingInterval' && !isBillingAmountLoaded) ? (
        <WorkspacePlanSelection
          plan={selectedPlan}
          setPlan={setPlan}
          loading={
            (step === 'InlineCheckout' && !isPaddleInitialised) ||
            (step === 'ConfirmBillingInterval' && !isBillingAmountLoaded)
          }
        />
      ) : null}
      {step === 'InlineCheckout' && (
        <div
          style={{
            width: isPaddleInitialised ? 'auto' : 0,
            height: isPaddleInitialised ? 'auto' : 0,
            overflow: 'hidden',
          }}
        >
          <InlineCheckout plan={selectedPlan} />
        </div>
      )}
      {step === 'ConfirmBillingInterval' && (
        <ConfirmBillingInterval plan={selectedPlan} />
      )}
    </Stack>
  );
};
