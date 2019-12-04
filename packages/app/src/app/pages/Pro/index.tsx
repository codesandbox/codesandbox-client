import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
  ButtonAsLink,
  Heading,
  HelpText,
  LinkButton,
  ModalBackdrop,
  SignInModal,
  SignInButton,
  SubHeading,
} from './elements';

const Pro: React.FC = () => {
  const {
    state: { isLoggedIn, user, hasLoadedApp, patron, isPatron },
    actions: {
      modalOpened,
      patron: {
        createSubscriptionClicked,
        cancelSubscriptionClicked,
        patronMounted,
      },
    },
  } = useOvermind();

  const checkoutDisabled = !hasLoadedApp || !isLoggedIn;

  let subscriptionType: string;
  if (isPatron) subscriptionType = 'patron';
  else subscriptionType = user && user.subscription && user.subscription.plan;

  useEffect(() => {
    patronMounted();
  }, [patronMounted]);

  return (
    <ThemeProvider theme={theme}>
      <Page>
        <Helmet>
          <title>Pro - CodeSandbox</title>
        </Helmet>

        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="CodeSandbox Pro" />

          <MaxWidth width={1024}>
            <>
              {hasLoadedApp && !isLoggedIn && (
                <>
                  <ModalBackdrop />
                  <SignInModal>
                    <p>Sign in to continue</p>
                    <SignInButton />
                  </SignInModal>
                </>
              )}

              <Content>
                {subscriptionType ? (
                  <MaxWidth width={400}>
                    <Centered horizontal>
                      {subscriptionType && (
                        <>
                          <Avatar src={user.avatarUrl} />
                          <Badge type={subscriptionType}>
                            {subscriptionType}
                          </Badge>
                          <Heading>You&apos;re a Pro!</Heading>
                        </>
                      )}

                      {subscriptionType === 'pro' ? (
                        <>
                          <ButtonAsLink href="/s/" style={{ marginTop: 30 }}>
                            Create a sandbox
                          </ButtonAsLink>

                          <HelpText>
                            You will be billed on the <b>30th</b> of each month.
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
                        </>
                      ) : (
                        <>
                          <SubHeading>
                            Thank you for being an early supporter of
                            CodeSandbox. As a patron, you can access all Pro
                            features.
                          </SubHeading>
                          <ButtonAsLink href="/s/">
                            Create a sandbox
                          </ButtonAsLink>

                          <HelpText>
                            You will be billed on the <b>29th</b> of each month.
                            You can{' '}
                            <a href="/patron">modify your contribution</a> at
                            any time.
                          </HelpText>
                        </>
                      )}
                    </Centered>
                  </MaxWidth>
                ) : (
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
                )}
              </Content>
            </>
          </MaxWidth>
        </Margin>
      </Page>
    </ThemeProvider>
  );
};

export default Pro;
