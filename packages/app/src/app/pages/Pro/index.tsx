import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import theme from '@codesandbox/common/lib/design-language/theme';
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
  ModalBackdrop,
  SignInModal,
  SignInButton,
  SubHeading,
} from './elements';

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

  useEffect(() => {
    patronMounted();
  }, [patronMounted]);

  const getContent = () => {
    /**
     * Proceed with caution
     * There is logic baked in the order of
     * the conditions.
     */
    if (!hasLoadedApp) return null;

    if (!isLoggedIn) return <LoggedOut />;

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
    <ThemeProvider theme={theme}>
      <Page>
        <Helmet>
          <title>Pro - CodeSandbox</title>
        </Helmet>

        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="CodeSandbox Pro" />

          <MaxWidth width={1024}>
            <Content>{getContent()}</Content>
          </MaxWidth>
        </Margin>
      </Page>
    </ThemeProvider>
  );
};

const LoggedOut = () => (
  <>
    <ModalBackdrop />
    <SignInModal>
      <p>Sign in to continue</p>
      <SignInButton />
    </SignInModal>
  </>
);

const Pro = ({ user, modalOpened, cancelSubscriptionClicked }) => (
  <MaxWidth width={400}>
    <Centered horizontal>
      <Avatar src={user.avatarUrl} />
      <Badge type="pro">Pro</Badge>
      <Heading>You&apos;re a Pro!</Heading>

      <ButtonAsLink href="/s/" style={{ marginTop: 30 }}>
        Create a sandbox
      </ButtonAsLink>

      <HelpText>
        You will be billed on the{' '}
        <b>{format(new Date(user.subscription.since), 'do')}</b> of each month.
        You can{' '}
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
}) => (
  <>
    <Heading>CodeSandbox Pro</Heading>
    <SubHeading>$12/month</SubHeading>
    <Centered horizontal>
      <SubscribeForm
        subscribe={({ token, coupon }) =>
          createSubscriptionClicked({ token, coupon })
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
        <Button onClick={updateSubscriptionClicked} style={{ marginTop: 30 }}>
          Reactivate subscription
        </Button>
      )}
    </Centered>
  </MaxWidth>
);

export default ProPage;
