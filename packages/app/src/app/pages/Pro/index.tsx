import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import React from 'react';
import { sortBy } from 'lodash-es';
import { useHistory, useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import {
  ThemeProvider,
  Switch,
  Stack,
  Text,
  Menu,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { TeamMemberAuthorization } from 'app/graphql/types';

import { SubscribeForm } from './subscribe-form';
import {
  Page,
  Content,
  Avatar,
  Badge,
  Button,
  ButtonAsLink,
  Heading,
  HelpText,
  LinkButton,
  SubHeading,
  DurationChoice,
  BillText,
} from './elements';
import { SignInModalElement } from '../SignIn/Modal';

const ProPage: React.FC = () => {
  const {
    state: { hasLoadedApp, isLoggedIn, user, patron },
    actions: {
      modalOpened,
      patron: {
        priceChanged,
        createSubscriptionClicked,
        cancelSubscriptionClicked,
        updateSubscriptionClicked,
        patronMounted,
      },
    },
  } = useOvermind();

  const checkoutDisabled = !hasLoadedApp || !isLoggedIn;

  // silly hack to allow cached versions to keep working
  priceChanged({ price: 12 });

  React.useEffect(() => {
    patronMounted();
  }, [patronMounted]);

  const location = useLocation();

  const getContent = () => {
    /**
     * Proceed with caution
     * There is logic baked in the order of
     * the conditions.
     */
    if (!hasLoadedApp) return null;

    if (!isLoggedIn) return <SignInModalElement />;

    if (location.search.includes('v=2')) return <Upgrade />;

    if (!user.subscription) {
      return (
        <NotPro
          createSubscriptionClicked={createSubscriptionClicked}
          user={user}
          patron={patron}
          checkoutDisabled={checkoutDisabled}
        />
      );
    }

    if (user.subscription.plan === 'patron') return <Patron user={user} />;

    /** Pro subscriptions land ⬇️ */

    if (user.subscription.cancelAtPeriodEnd) {
      return (
        <Expiring
          user={user}
          updateSubscriptionClicked={updateSubscriptionClicked}
          isUpdatingSubscription={patron.isUpdatingSubscription}
        />
      );
    }

    if (user.subscription.plan === 'pro') {
      return (
        <Pro
          user={user}
          modalOpened={modalOpened}
          cancelSubscriptionClicked={cancelSubscriptionClicked}
        />
      );
    }

    return null;
  };

  return (
    <ThemeProvider>
      <Page>
        <Navigation title="CodeSandbox Pro" />

        <Helmet>
          <title>Pro - CodeSandbox</title>
        </Helmet>

        <Margin vertical={1.5} horizontal={1.5}>
          <MaxWidth width={1024}>
            <Content>{getContent()}</Content>
          </MaxWidth>
        </Margin>
      </Page>
    </ThemeProvider>
  );
};

const Pro = ({ user, modalOpened, cancelSubscriptionClicked }) => {
  const subscriptionDate = new Date(user.subscription.since);
  return (
    <MaxWidth width={400}>
      <Centered horizontal>
        <Avatar src={user.avatarUrl} />
        <Badge type="pro">Pro</Badge>
        <Heading>You&apos;re a Pro!</Heading>

        <ButtonAsLink href="/s/" style={{ marginTop: 30 }}>
          Create a sandbox
        </ButtonAsLink>

        <HelpText>
          You will be billed{' '}
          {user.subscription.duration === 'yearly' ? (
            <>
              and charged{' '}
              <b>annually on {format(subscriptionDate, 'MMM dd')}</b>
            </>
          ) : (
            <>
              on the <b>{format(subscriptionDate, 'do')} of each month</b>
            </>
          )}
          . You can{' '}
          <LinkButton
            onClick={e => {
              e.preventDefault();
              modalOpened({
                modal: 'preferences',
                itemId: 'paymentInfo',
              });
            }}
          >
            update your payment details
          </LinkButton>{' '}
          or{' '}
          <LinkButton
            onClick={e => {
              e.preventDefault();
              cancelSubscriptionClicked();
            }}
          >
            cancel your subscription
          </LinkButton>{' '}
          at any time.
        </HelpText>
      </Centered>
    </MaxWidth>
  );
};

const Patron = ({ user }) => (
  <MaxWidth width={400}>
    <Centered horizontal>
      <Avatar src={user.avatarUrl} />
      <Badge type="patron">Patron</Badge>
      <Heading>You&apos;re a Pro!</Heading>

      <SubHeading>
        Thank you for being an early supporter of CodeSandbox. As a patron, you
        can access all Pro features.
      </SubHeading>
      <ButtonAsLink href="/s/">Create a sandbox</ButtonAsLink>

      <HelpText>
        You will be billed on the{' '}
        <b>{format(new Date(user.subscription.since), 'do')}</b> of each month.
        You can <a href="/patron">modify your contribution</a> at any time.
      </HelpText>
    </Centered>
  </MaxWidth>
);

const NotPro = ({
  createSubscriptionClicked,
  user,
  patron,
  checkoutDisabled,
}) => {
  const [duration, setDuration] = React.useState('yearly');

  return (
    <>
      <Heading>CodeSandbox Pro</Heading>
      <SubHeading>
        {duration === 'yearly' ? '$9/month billed annually' : '12$/month'}
      </SubHeading>
      <DurationChoice>
        <BillText on={duration === 'monthly'}>Bill monthly</BillText>
        <Switch
          onChange={() =>
            setDuration(d => (d === 'yearly' ? 'monthly' : 'yearly'))
          }
          on={duration === 'yearly'}
        />
        <BillText on={duration === 'yearly'}>Bill annually</BillText>
      </DurationChoice>
      <Centered horizontal>
        <SubscribeForm
          subscribe={({ token, coupon }) =>
            createSubscriptionClicked({ token, coupon, duration })
          }
          isLoading={patron.isUpdatingSubscription}
          hasCoupon
          name={user && user.name}
          error={patron.error}
          disabled={checkoutDisabled}
        />
      </Centered>
    </>
  );
};

const Expiring = ({
  user,
  updateSubscriptionClicked,
  isUpdatingSubscription,
}) => (
  <MaxWidth width={500}>
    <Centered horizontal>
      <Avatar src={user.avatarUrl} />
      <Badge type="pro" style={{ opacity: 0.8 }}>
        Pro
      </Badge>
      <Heading>Your subscription is expiring</Heading>

      <HelpText>
        Your subscription will be automatically cancelled on your next billing
        date ({format(new Date(user.subscription.since), 'do MMM')}). All your
        private sandboxes will remain available and private.
      </HelpText>

      {isUpdatingSubscription ? (
        <Button disabled style={{ marginTop: 30 }}>
          Creating subscription...
        </Button>
      ) : (
        <Button
          onClick={() => updateSubscriptionClicked({ coupon: '' })}
          style={{ marginTop: 30 }}
        >
          Reactivate subscription
        </Button>
      )}
    </Centered>
  </MaxWidth>
);

const prettyPermissions = {
  ADMIN: 'Admin',
  WRITE: 'Editor',
  READ: 'Viewer',
};

const Upgrade = () => {
  const {
    state: { personalWorkspaceId, user, activeTeam, dashboard },
    actions: { setActiveTeam },
  } = useOvermind();

  const location = useLocation();
  const history = useHistory();
  const workspaceId = new URLSearchParams(location.search).get('workspace');

  React.useEffect(() => {
    // set workspace in url when coming from places without workspace context
    if (activeTeam && !workspaceId) {
      history.replace({
        pathname: location.pathname,
        search: '?v=2&workspace=' + activeTeam,
      });
    } else if (workspaceId !== activeTeam) {
      setActiveTeam({ id: workspaceId });
    }
  }, [workspaceId, activeTeam, history, location, setActiveTeam]);

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

  const isPersonalWorkspace = personalWorkspaceId === activeTeam;
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

  return (
    <Stack justify="center" align="center" css={css({ fontSize: 3 })}>
      <Stack
        direction="vertical"
        gap={10}
        css={css({
          width: 360,
          backgroundColor: 'grays.700',
          borderRadius: 'medium',
          padding: 8,
        })}
      >
        <Stack direction="vertical" gap={6}>
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
              <Menu>
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
                    width: '100%',
                    maxWidth: 320,
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
                    onSelect={() =>
                      history.push(dashboardUrls.createWorkspace())
                    }
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
            })}
          >
            <Text weight="semibold">Current plan</Text>
            <Text>{currentPlanName}</Text>
          </Stack>

          {isPersonalWorkspace ? null : (
            <Stack
              direction="vertical"
              gap={1}
              css={css({
                paddingX: 4,
                paddingY: 2,
                border: '1px solid',
                borderColor: 'grays.500',
                borderRadius: 'small',
              })}
            >
              <Text weight="semibold">
                {numberOfEditors} {numberOfEditors === 1 ? 'Editor' : 'Editors'}{' '}
                on your team
              </Text>
              <Text variant="muted">
                ({numberOfViewers}{' '}
                {numberOfViewers === 1 ? 'viewer' : 'viewers'} on your team)
              </Text>
            </Stack>
          )}
        </Stack>

        {onPaidPlan ? null : <Button>Upgrade to Pro Workspace</Button>}
      </Stack>
    </Stack>
  );
};

export default ProPage;
