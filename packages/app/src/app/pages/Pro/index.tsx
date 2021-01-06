import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import React from 'react';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { ThemeProvider, Switch, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';

import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

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

  const getContent = () => {
    /**
     * Proceed with caution
     * There is logic baked in the order of
     * the conditions.
     */
    if (!hasLoadedApp) return null;

    if (!isLoggedIn) return <SignInModalElement />;

    return <Upgrade />;

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

const Upgrade = () => {
  const {
    state: { personalWorkspaceId, user, activeTeam, activeTeamInfo, dashboard },
    actions,
  } = useOvermind();

  const [activeAccount, setActiveAccount] = React.useState<{
    id: string;
    name: string;
    avatarUrl: string;
  } | null>(null);

  React.useEffect(() => {
    if (activeTeam) {
      const team = dashboard.teams.find(({ id }) => id === activeTeam);

      if (team)
        setActiveAccount({
          id: team.id,
          name: team.name,
          avatarUrl: team.avatarUrl,
        });
    }
  }, [activeTeam, activeTeamInfo, dashboard.teams]);

  if (!activeAccount) return null;

  const isPersonalWorkspace = personalWorkspaceId === activeTeam;
  const numberOfEditors = activeTeamInfo.userAuthorizations.filter(member =>
    ['ADMIN', 'WRITE'].includes(member.authorization)
  ).length;
  const numberOfViewers = activeTeamInfo.userAuthorizations.filter(member =>
    ['READ'].includes(member.authorization)
  ).length;

  const isPersonalPro = isPersonalWorkspace || user.subscription;
  const isTeamPro = activeTeamInfo.joinedPilotAt;

  let currentPlanName: string;
  if (isTeamPro) currentPlanName = 'Team Pro';
  else if (isPersonalPro) currentPlanName = 'Personal Pro';
  else currentPlanName = 'Community workspace (Free)';

  return (
    <Stack justify="center" align="center" css={css({ fontSize: 3 })}>
      <div css={{ width: 300 }}>
        <Text
          as="h1"
          size={8}
          block
          align="center"
          weight="bold"
          marginBottom={6}
        >
          Upgrade to <br />
          Pro workspace
        </Text>

        <Stack direction="vertical" gap={6} marginBottom={10}>
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
              <WorkspaceSelect
                onSelect={workspace => {
                  actions.setActiveTeam({
                    id: workspace.id,
                  });
                }}
                activeAccount={activeAccount}
              />
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

        <Button>Upgrade to Pro Workspace</Button>
      </div>
    </Stack>
  );
};

export default ProPage;
