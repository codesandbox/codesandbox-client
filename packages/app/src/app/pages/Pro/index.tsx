import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from 'styled-components';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { SignInButton } from 'app/pages/common/SignInButton';

import theme from '@codesandbox/common/lib/design-language/theme';
import { SubscribeForm } from './subscribe-form';
import { Content, Heading, SubHeading } from './elements';

const Pro: React.FC = () => {
  const {
    state: { isLoggedIn, user, patron, isPatron },
    actions: {
      patron: { createSubscriptionClicked, patronMounted },
    },
  } = useOvermind();

  useEffect(() => {
    patronMounted();
  }, [patronMounted]);

  // if you're already a patron, you shouldn't
  // try to get pro.
  // if (isPatron) location.href = '/patron';

  return (
    <ThemeProvider theme={theme}>
      <Content>
        <Helmet>
          <title>Pro - CodeSandbox</title>
        </Helmet>

        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="CodeSandbox Pro" />

          <MaxWidth width={1024}>
            <>
              <Heading>CodeSandbox Pro</Heading>
              <SubHeading>$12/month</SubHeading>

              <Centered horizontal>
                {isLoggedIn ? (
                  <SubscribeForm
                    subscribe={({ token, coupon }) =>
                      createSubscriptionClicked({ token, coupon })
                    }
                    isLoading={patron.isUpdatingSubscription}
                    hasCoupon
                    name={user.name}
                    error={patron.error}
                  />
                ) : (
                  <SignInButton />
                )}
              </Centered>
            </>
          </MaxWidth>
        </Margin>
      </Content>
    </ThemeProvider>
  );
};

export default Pro;
