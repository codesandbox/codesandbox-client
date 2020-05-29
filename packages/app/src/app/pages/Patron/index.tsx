import Centered from '@codesandbox/common/es/components/flex/Centered';
import MaxWidth from '@codesandbox/common/es/components/flex/MaxWidth';
import Margin from '@codesandbox/common/es/components/spacing/Margin';
import codeSandboxBlackTheme from '@codesandbox/common/es/themes/codesandbox-black';
import { Element, ThemeProvider } from '@codesandbox/components';
import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { Content } from './elements';
import { PricingModal } from './PricingModal';

const Patron: React.FC = () => {
  const {
    state: { hasLoadedApp, hasLogIn, user },
    actions,
  } = useOvermind();

  if (!hasLogIn) {
    location.href = '/pro';
  }
  // don't send them away before authentication
  if (hasLoadedApp && user) {
    if (!user.subscription) {
      location.href = '/pricing'; // if no subscription, to pricing with you!
    } else if (
      user.subscription.plan !== 'patron' // if subscription but not patron, go to pro
    ) {
      location.href = '/pro';
    }
  }

  useEffect(() => {
    actions.patron.patronMounted();
  }, [actions]);

  return (
    <ThemeProvider theme={codeSandboxBlackTheme}>
      <Element style={{ width: '100vw', height: '100vh' }}>
        <Navigation title="Become a Patron" />
        <MaxWidth>
          <>
            <Helmet>
              <title>Patron - CodeSandbox</title>
            </Helmet>
            <Margin vertical={1.5} horizontal={1.5}>
              <Content>
                <MaxWidth width={1024}>
                  <>
                    <Title>Become a CodeSandbox Patron!</Title>
                    <SubTitle>
                      You can support us by paying a monthly amount of your
                      choice.
                      <br />
                      The money goes to all expenses of CodeSandbox.
                    </SubTitle>

                    <Centered horizontal>
                      <PricingModal />
                    </Centered>
                  </>
                </MaxWidth>
              </Content>
            </Margin>
          </>
        </MaxWidth>
      </Element>
    </ThemeProvider>
  );
};

export default Patron;
