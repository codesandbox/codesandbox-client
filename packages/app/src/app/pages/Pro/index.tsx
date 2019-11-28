import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { useOvermind } from 'app/overmind';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import { Navigation } from 'app/pages/common/Navigation';
import { SignInButton } from 'app/pages/common/SignInButton';
import { SubscribeForm } from 'app/components/SubscribeForm';
import { Content } from './elements';

const Pro: React.FC = () => {
  const {
    state: { isLoggedIn, user, patron },
    actions: {
      patron: { createSubscriptionClicked, patronMounted },
    },
  } = useOvermind();

  useEffect(() => {
    patronMounted();
  }, [patronMounted]);

  return (
    <MaxWidth>
      <>
        <Helmet>
          <title>Pro - CodeSandbox</title>
        </Helmet>
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="CodeSandbox Pro" />
          <Content>
            <MaxWidth width={1024}>
              <>
                <Title>CodeSandbox Pro</Title>
                <SubTitle>$12/month</SubTitle>

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
          </Content>
        </Margin>
      </>
    </MaxWidth>
  );
};

export default Pro;
