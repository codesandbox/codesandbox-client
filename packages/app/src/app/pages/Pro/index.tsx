import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { useOvermind } from 'app/overmind';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import { Navigation } from 'app/pages/common/Navigation';

import { Content } from './elements';

const Pro: React.FC = () => {
  const { actions } = useOvermind();

  useEffect(() => {
    actions.patron.patronMounted();
  }, [actions]);

  return (
    <MaxWidth>
      <>
        <Helmet>
          <title>Patron - CodeSandbox</title>
        </Helmet>
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="CodeSandbox Pro" />
          <Content>
            <MaxWidth width={1024}>
              <>
                <Title>CodeSandbox Pro</Title>
                <SubTitle>$12/month</SubTitle>

                <Centered horizontal>hi</Centered>
              </>
            </MaxWidth>
          </Content>
        </Margin>
      </>
    </MaxWidth>
  );
};

export default Pro;
