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

const UpgradeSteps = () => {
  // step 1 - choose workspace
  // step 2 - loading inline checkout in background
  // step 3 - switch to inline checkout

  const [step, setStep] = React.useState(1);
  const [plan, setPlan] = React.useState(null);
  const [checkoutReady, setCheckoutReady] = React.useState(false);

  React.useEffect(() => {
    if (checkoutReady) setStep(3);
  }, [checkoutReady]);

  return (
    <Stack
      justify="center"
      align="center"
      css={css({ fontSize: 3, marginTop: 160 })}
    >
      <Stack
        direction="vertical"
        as={motion.div}
        initial={{ height: 'auto', width: 'auto' }}
        animate={{ height: 'auto', width: 'auto' }}
        css={css({
          minWidth: 360,
          backgroundColor: 'grays.600',
          borderRadius: 'medium',
          padding: 8,
        })}
      >
        {step < 3 && (
          <Upgrade
            setPlan={setPlan}
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
            <InlineCheckout plan={plan} setCheckoutReady={setCheckoutReady} />
          </div>
        )}
      </Stack>
    </Stack>
  );
};

const Upgrade = ({ loading, setPlan, nextStep }) => {
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
  React.useEffect(() => {
    setPlan(isPersonalWorkspace ? 'Personal' : 'Team');
  });

  if (!activeTeam || !dashboard.teams.length) return null;

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

  const isPersonalPro = isPersonalWorkspace || user.subscription;
  const isTeamPro = activeWorkspace.joinedPilotAt;

  let currentPlanName: string;
  if (isTeamPro) currentPlanName = 'Team Pro';
  else if (isPersonalWorkspace && isPersonalPro) {
    currentPlanName = 'Personal Pro';
  } else currentPlanName = 'Community workspace (Free)';

  const onPaidPlan = isTeamPro || (isPersonalWorkspace && isPersonalPro);

  // if there is mismatch of intent, open the workspace switcher on load
  const switcherDefaultOpen =
    (type === 'team' && isPersonalWorkspace) ||
    (type === 'personal' && !isPersonalWorkspace);

  return (
    <>
      <Stack direction="vertical">
        <Stack direction="vertical" gap={1}>
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
                  width: '296px',
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

        <Stack
          direction="vertical"
          gap={1}
          css={css({
            paddingX: 4,
            paddingY: 2,
            border: '1px solid',
            borderColor: 'grays.500',
            borderRadius: 'small',
            marginTop: 6,
          })}
        >
          <Text weight="semibold">Current plan</Text>
          <Text>{currentPlanName}</Text>
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
                  paddingX: 4,
                  paddingY: 2,
                  border: '1px solid',
                  borderColor: 'grays.500',
                  borderRadius: 'small',
                  overflow: 'hidden',
                })}
              >
                <Text weight="semibold">
                  {numberOfEditors}{' '}
                  {numberOfEditors === 1 ? 'Editor' : 'Editors'} on your team
                </Text>
                <Text variant="muted">
                  ({numberOfViewers}{' '}
                  {numberOfViewers === 1 ? 'viewer' : 'viewers'} on your team)
                </Text>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
      <AnimatePresence>
        {!onPaidPlan && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 40 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Button loading={loading} onClick={() => nextStep()}>
              Upgrade to Pro Workspace
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const InlineCheckout = ({ plan, setCheckoutReady }) => {
  // constants, move them somewhere
  const VENDOR_ID = 729;
  const planId = { personal: 7365, team: 7407 };

  const email = 'sid@codesandbox.io';

  React.useEffect(() => {
    // @ts-ignore 3rd party integration with global
    const Paddle = window.Paddle;

    Paddle.Environment.set('sandbox');
    Paddle.Setup({ vendor: VENDOR_ID });

    // @ts-ignore 3rd party integration with global
    window.loadCallback = () => {
      setCheckoutReady(true);
    };

    Paddle.Checkout.open({
      method: 'inline',
      product: planId[plan], // Replace with your Product or Plan ID
      email,
      displayModeTheme: 'dark',
      allowQuantity: true,
      disableLogout: true,
      frameTarget: 'checkout-container', // The className of your checkout <div>
      frameInitialHeight: 416,
      frameStyle: `
        width: 500px;
        min-width:500px;
        background-color:
        transparent; border: none;
      `,
      loadCallback: 'loadCallback',
    });
  }, [setCheckoutReady]);

  return <div className="checkout-container" />;
};
