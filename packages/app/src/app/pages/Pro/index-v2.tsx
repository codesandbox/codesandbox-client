import React from 'react';
import { Helmet } from 'react-helmet';
import { sortBy } from 'lodash-es';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import {
  ThemeProvider,
  Stack,
  Text,
  Menu,
  Icon,
  Button,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { NewTeam } from 'app/pages/common/NewTeam';
import { TeamMemberAuthorization } from 'app/graphql/types';

export const ProPage: React.FC = () => (
  <ThemeProvider>
    <Helmet>
      <title>Pro - CodeSandbox</title>
      <script src="https://cdn.paddle.com/paddle/paddle.js" />
    </Helmet>
    <Stack
      direction="vertical"
      css={css({
        backgroundColor: 'grays.900',
        color: '#fff',
        width: ' 100vw',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
      })}
    >
      <Navigation title="CodeSandbox Pro" />

      <Switch>
        <Route path={`/pro/create-workspace`}>
          <NewTeam redirectTo="/pro?v=2" />;
        </Route>
        <Route path={`/pro`}>
          <UpgradeSteps />
        </Route>
      </Switch>
    </Stack>
  </ThemeProvider>
);

const prettyPermissions = {
  ADMIN: 'Admin',
  WRITE: 'Editor',
  READ: 'Viewer',
};

type Plan = {
  id: string;
  name: string;
  type: 'personal' | 'team';
  frequency: 'monthly' | 'annual';
  unit: number;
  multiplier: number;
  currency: string;
};

const PADDLE_VENDOR_ID = 729;
const plans: { [key: string]: Plan } = {
  PERSONAL_PRO_MONTHLY: {
    id: '7365',
    name: 'Personal Pro Workspace',
    type: 'personal',
    unit: 12,
    multiplier: 1,
    frequency: 'monthly',
    currency: '$',
  },
  PERSONAL_PRO_ANNUAL: {
    id: '7399',
    name: 'Personal Pro Workspace',
    type: 'personal',
    unit: 9,
    multiplier: 12,
    frequency: 'annual',
    currency: '$',
  },
  TEAM_PRO_MONTHLY: {
    id: '7407',
    name: 'Team Pro Workspace',
    type: 'team',
    unit: 30,
    multiplier: 1,
    frequency: 'monthly',
    currency: '$',
  },
  TEAM_PRO_ANNUAL: {
    id: '7399',
    name: 'Team Pro Workspace',
    type: 'team',
    unit: 24,
    multiplier: 12,
    frequency: 'annual',
    currency: '$',
  },
};

const UpgradeSteps = () => {
  // step 1 - choose workspace
  // step 2 - loading inline checkout in background
  // step 3 - inline checkout
  const [step, setStep] = React.useState(1);

  const [plan, setPlan] = React.useState(null);
  const [seats, setSeats] = React.useState(1);
  const [checkoutReady, setCheckoutReady] = React.useState(false);

  React.useEffect(() => {
    if (checkoutReady) setStep(3);
  }, [checkoutReady]);

  return (
    <Stack
      justify="center"
      align="center"
      css={css({ fontSize: 3, width: 560, marginTop: 120, marginX: 'auto' })}
    >
      {step < 3 && (
        <Upgrade
          plan={plan}
          setPlan={setPlan}
          setSeats={setSeats}
          loading={step === 2}
          nextStep={() => setStep(2)}
        />
      )}
      {step > 1 && (
        <div
          style={{
            width: step === 2 ? 0 : 'auto',
            height: step === 2 ? 0 : 'auto',
            overflow: 'hidden',
          }}
        >
          <InlineCheckout
            plan={plan}
            seats={seats}
            setCheckoutReady={setCheckoutReady}
          />
        </div>
      )}
    </Stack>
  );
};

const Upgrade = ({ loading, plan, setPlan, setSeats, nextStep }) => {
  const {
    state: { personalWorkspaceId, user, activeTeam, dashboard },
    actions: { setActiveTeam },
  } = useOvermind();

  const location = useLocation();
  const history = useHistory();
  const workspaceId = new URLSearchParams(location.search).get('workspace');
  const type = new URLSearchParams(location.search).get('type');

  React.useEffect(() => {
    // set workspace in url when coming from places without workspace context
    if (activeTeam && !workspaceId) {
      history.replace({
        pathname: location.pathname,
        search: `?v=2&workspace=${activeTeam}&type=${type}`,
      });
    } else if (workspaceId !== activeTeam) {
      setActiveTeam({ id: workspaceId });
    }
  }, [workspaceId, activeTeam, history, location, setActiveTeam, type]);

  const isPersonalWorkspace = personalWorkspaceId === activeTeam;
  const [billingFrequency, setBillingFrequency] = React.useState<
    Plan['frequency']
  >('monthly');

  React.useEffect(() => {
    let newPlan: typeof plans[keyof typeof plans];
    if (isPersonalWorkspace) {
      if (billingFrequency === 'annual') newPlan = plans.PERSONAL_PRO_ANNUAL;
      else newPlan = plans.PERSONAL_PRO_MONTHLY;
    } else {
      if (billingFrequency === 'annual') newPlan = plans.TEAM_PRO_ANNUAL;
      else newPlan = plans.TEAM_PRO_MONTHLY;
    }
    setPlan(newPlan);
  }, [isPersonalWorkspace, billingFrequency]);

  if (!activeTeam || !dashboard.teams.length || !plan) return null;

  const personalWorkspace = dashboard.teams.find(
    t => t.id === personalWorkspaceId
  )!;

  const getUserAuthorization = workspace => {
    const userAuthorization = workspace.userAuthorizations.find(
      authorization => authorization.userId === user.id
    ).authorization;
    return userAuthorization;
  };

  const workspaces = [
    personalWorkspace,
    ...sortBy(
      dashboard.teams.filter(t => t.id !== personalWorkspaceId),
      [getUserAuthorization, 'name']
    ),
  ];

  const activeWorkspace = workspaces.find(
    workspace => workspace.id === activeTeam
  );

  const numberOfViewers = activeWorkspace.userAuthorizations.filter(
    ({ authorization }) => authorization === TeamMemberAuthorization.Read
  ).length;
  const numberOfEditors = activeWorkspace.userAuthorizations.filter(
    ({ authorization }) => authorization !== TeamMemberAuthorization.Read
  ).length;
  setSeats(numberOfEditors);

  const isPersonalPro = isPersonalWorkspace || user.subscription;
  const isTeamPro = activeWorkspace.joinedPilotAt;

  // TODO: use this
  // const onPaidPlan = isTeamPro || (isPersonalWorkspace && isPersonalPro);

  // if there is mismatch of intent, open the workspace switcher on load
  const switcherDefaultOpen =
    (type === 'team' && isPersonalWorkspace) ||
    (type === 'personal' && !isPersonalWorkspace);

  return (
    <>
      <div style={{ width: '100%' }}>
        <Text size={7} as="h1" block align="center" marginBottom={4}>
          Upgrade to Pro
        </Text>
        <Text
          size={3}
          variant="muted"
          block
          align="center"
          marginBottom={8}
          css={{ maxWidth: 560 }}
        >
          Join our community of creators from {plan.currency}
          {plan.unit}/month.
          <br /> Cancel at any time, effective at the end of the payment period.
        </Text>
        <Stack direction="vertical" gap={1} marginBottom={6}>
          <Text>Workspace</Text>
          <Stack
            css={css({
              button: {
                border: '1px solid',
                borderColor: 'grays.500',
                borderRadius: 'small',
                paddingY: 1,
                img: { size: 6 },
                span: { fontSize: 3, maxWidth: 'calc(100% - 16px)' },
              },
            })}
          >
            <Menu defaultOpen={switcherDefaultOpen}>
              <Stack
                as={Menu.Button}
                justify="space-between"
                align="center"
                css={css({
                  width: '100%',
                  height: '100%',
                  paddingLeft: 2,
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: 'grays.600',
                  },
                })}
              >
                <Stack gap={2} as="span" align="center">
                  <Stack as="span" align="center" justify="center">
                    <TeamAvatar
                      avatar={activeWorkspace.avatarUrl}
                      name={activeWorkspace.name}
                    />
                  </Stack>
                  <Text size={4} weight="normal" maxWidth={140}>
                    {activeWorkspace.name}
                  </Text>
                </Stack>
                <Icon name="caret" size={8} />
              </Stack>
              <Menu.List
                css={css({
                  width: '560px',
                  marginTop: '-4px',
                  backgroundColor: 'grays.600',
                })}
                style={{ backgroundColor: '#242424', borderColor: '#343434' }} // TODO: find a way to override reach styles without the selector mess
              >
                {workspaces.map(workspace => {
                  const userAuthorization = getUserAuthorization(workspace);

                  return (
                    <Stack
                      as={Menu.Item}
                      key={workspace.id}
                      justify="space-between"
                      align="center"
                      css={css({
                        height: 10,
                        textAlign: 'left',
                        backgroundColor: 'grays.600',
                        borderBottom: '1px solid',
                        borderColor: 'grays.500',
                        '&[data-reach-menu-item][data-component=MenuItem][data-selected]': {
                          backgroundColor: 'grays.500',
                        },
                      })}
                      style={{ paddingLeft: 8 }}
                      data-disabled={
                        userAuthorization !== TeamMemberAuthorization.Admin
                          ? true
                          : null
                      }
                      onSelect={() => {
                        if (
                          userAuthorization === TeamMemberAuthorization.Admin
                        ) {
                          setActiveTeam({ id: workspace.id });
                        }
                      }}
                    >
                      <Stack gap={2} align="center" css={{ width: '100%' }}>
                        <TeamAvatar
                          avatar={workspace.avatarUrl}
                          name={workspace.name}
                          size="small"
                        />
                        <Text size={3} maxWidth="100%">
                          {workspace.name}
                          {workspace.id === personalWorkspaceId &&
                            ' (Personal)'}
                        </Text>
                      </Stack>

                      {activeWorkspace.id === workspace.id && (
                        <Icon name="simpleCheck" />
                      )}

                      {userAuthorization !== TeamMemberAuthorization.Admin &&
                        prettyPermissions[userAuthorization]}
                    </Stack>
                  );
                })}
                <Stack
                  as={Menu.Item}
                  align="center"
                  gap={2}
                  css={css({
                    height: 10,
                    textAlign: 'left',
                  })}
                  style={{ paddingLeft: 8 }}
                  onSelect={() => history.push('/pro/create-workspace?v=2')}
                >
                  <Stack
                    justify="center"
                    align="center"
                    css={css({
                      size: 6,
                      borderRadius: 'small',
                      border: '1px solid',
                      borderColor: 'grays.500',
                    })}
                  >
                    <Icon name="plus" size={10} />
                  </Stack>
                  <Text size={3}>Create a new workspace</Text>
                </Stack>
              </Menu.List>
            </Menu>
          </Stack>
        </Stack>
        <Stack gap={7}>
          {isPersonalWorkspace ? (
            <>
              <PlanCard
                plan={plans.PERSONAL_PRO_MONTHLY}
                billingFrequency={billingFrequency}
                setBillingFrequency={setBillingFrequency}
              />
              <PlanCard
                plan={plans.PERSONAL_PRO_ANNUAL}
                billingFrequency={billingFrequency}
                setBillingFrequency={setBillingFrequency}
              />
            </>
          ) : (
            <>
              <PlanCard
                plan={plans.TEAM_PRO_MONTHLY}
                billingFrequency={billingFrequency}
                setBillingFrequency={setBillingFrequency}
              />
              <PlanCard
                plan={plans.TEAM_PRO_ANNUAL}
                billingFrequency={billingFrequency}
                setBillingFrequency={setBillingFrequency}
              />
            </>
          )}
        </Stack>
        <AnimatePresence>
          {!isPersonalWorkspace && (
            <motion.div
              initial={{ height: 0, marginTop: 0 }}
              animate={{ height: 'auto', marginTop: 24 }}
              exit={{ height: 0, marginTop: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <Stack
                direction="vertical"
                gap={1}
                css={css({
                  padding: 4,
                  border: '1px solid',
                  borderColor: 'grays.500',
                  borderRadius: 'small',
                  overflow: 'hidden',
                })}
              >
                <Text size={3}>Workspace editors</Text>
                <Stack justify="space-between">
                  <Stack direction="vertical" gap={4}>
                    <Text variant="muted" size={3}>
                      {numberOfEditors}{' '}
                      {numberOfEditors === 1 ? 'seat' : 'seats'}
                      <Text size={2}> ✕ </Text> {plan.currency}
                      {plan.unit}{' '}
                      {plan.multiplier > 1 ? (
                        <>
                          <Text size={2}> ✕</Text> {plan.multiplier}
                        </>
                      ) : null}
                    </Text>
                    <Text variant="muted">
                      Prices listed in USD. Taxes may apply.
                    </Text>
                  </Stack>
                  <Text weight="semibold" size={4}>
                    {plan.currency}
                    {numberOfEditors * plan.unit * plan.multiplier} /{' '}
                    {plan.frequency === 'monthly' ? 'month' : 'year'}
                  </Text>
                </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 40 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Button
              loading={loading}
              onClick={() => nextStep()}
              css={css({ fontSize: 3, height: 10 })}
            >
              Continue
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

const PlanCard: React.FC<{
  plan: Plan;
  billingFrequency: Plan['frequency'];
  setBillingFrequency: (frequency: Plan['frequency']) => void;
}> = ({ plan, billingFrequency, setBillingFrequency }) => {
  const isSelected = plan.frequency === billingFrequency;

  return (
    <Stack
      direction="vertical"
      css={css({
        flexGrow: 1,
        padding: 4,
        border: '1px solid',
        borderRadius: 'small',
        borderColor: isSelected ? 'blues.600' : 'grays.600',
        backgroundColor: isSelected ? 'blues.900' : 'transparent',
        transition: 'borderColor, backgroundColor',
        transitionDuration: theme => theme.speeds[3],
      })}
    >
      <Stack as="label" justify="space-between" align="center">
        <Stack direction="vertical" gap={1}>
          <Text
            size={4}
            weight="semibold"
            css={{ textTransform: 'capitalize' }}
          >
            {plan.frequency}
          </Text>
          <Text size={3}>{plan.name}</Text>
          <Text size={3} variant="muted">
            {plan.currency}
            {plan.unit} {plan.type === 'team' ? 'per editor' : null} per month
          </Text>
        </Stack>
        <div>
          <input
            type="radio"
            hidden
            checked={isSelected}
            onChange={() => setBillingFrequency(plan.frequency)}
          />
          <Stack
            justify="center"
            align="center"
            css={css({
              size: 6,
              border: '2px solid',
              borderColor: 'grays.600',
              borderRadius: '50%',
              backgroundColor: isSelected ? 'blues.600' : 'transparent',
            })}
          >
            {isSelected && <Icon size={13} name="simpleCheck" />}
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
};

const InlineCheckout = ({ plan, seats = 1, setCheckoutReady }) => {
  const {
    state: { user },
  } = useOvermind();

  const [prices, updatePrices] = React.useState(null);

  const unitPricePreTax = prices && (prices.unit - prices.unit_tax).toFixed(2);
  const totalPricePreTax =
    prices && (prices.total - prices.total_tax).toFixed(2);

  React.useEffect(() => {
    // @ts-ignore 3rd party integration with global
    const Paddle = window.Paddle;

    Paddle.Environment.set('sandbox');
    Paddle.Setup({
      vendor: PADDLE_VENDOR_ID,
      eventCallback: event => {
        if (event.event === 'Checkout.Location.Submit') {
          updatePrices(event.eventData.checkout.prices.customer);
        }
      },
    });

    // @ts-ignore 3rd party integration with global
    window.loadCallback = () => setCheckoutReady(true);

    Paddle.Checkout.open({
      method: 'inline',
      product: plan.id, // Replace with your Product or Plan ID
      quantity: seats,
      email: user.email,
      frameTarget: 'checkout-container', // The className of your checkout <div>
      loadCallback: 'loadCallback',
      success: '/dashboard/settings',
      displayModeTheme: 'dark',
      allowQuantity: true,
      disableLogout: true,
      frameInitialHeight: 416,
      frameStyle: `
        width: 500px;
        min-width:500px;
        background-color:
        transparent; border: none;
      `,
    });
  }, [setCheckoutReady]);

  return (
    <div>
      <Text size={7} as="h1" block align="center" marginBottom={12}>
        Upgrade to Pro
      </Text>
      {prices && (
        <Stack
          direction="vertical"
          gap={2}
          css={css({
            padding: 4,
            marginBottom: 8,
            border: '1px solid',
            borderColor: 'grays.500',
            borderRadius: 'small',
            overflow: 'hidden',
          })}
        >
          <Text size={3}>Workspace editors</Text>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              {seats} {seats === 1 ? 'seat' : 'seats'}
              <Text size={2}> ✕ </Text>
              {prices.currency} {unitPricePreTax} ({plan.currency} {plan.unit})
              {plan.multiplier > 1 ? (
                <>
                  <Text size={2}> ✕</Text> {plan.multiplier}
                </>
              ) : null}
            </Text>
            <Text variant="muted" size={3}>
              {prices.currency} {totalPricePreTax} /{' '}
              {plan.frequency === 'monthly' ? 'month' : 'year'}
            </Text>
          </Stack>
          <Stack justify="space-between">
            <Text variant="muted" size={3}>
              Tax
            </Text>
            <Text variant="muted" size={3}>
              {prices.currency} {prices.total_tax}
            </Text>
          </Stack>
          <Stack
            justify="space-between"
            css={css({
              borderTop: '1px solid',
              borderColor: 'grays.500',
              paddingTop: 10,
            })}
          >
            <Text size={3}>Total</Text>
            <Text weight="semibold">
              {prices.currency} {prices.total}
            </Text>
          </Stack>
        </Stack>
      )}

      <div className="checkout-container" />
    </div>
  );
};
