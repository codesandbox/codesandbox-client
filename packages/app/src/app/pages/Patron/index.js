import Centered from '@codesandbox/common/lib/components/flex/Centered';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { useEffect } from 'react';
import { inject } from 'mobx-react';

import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import Navigation from 'app/pages/common/Navigation';

import { Content } from './elements';
import PricingModal from './PricingModal';

const Patron = ({ signals: { searchMounted } }) => {
  useEffect(() => {
    document.title = 'Patron - CodeSandbox';
  }, []);

  useEffect(() => {
    searchMounted();
  }, [searchMounted]);

  return (
    <MaxWidth>
      <Margin vertical={1.5} horizontal={1.5}>
        <Navigation title="Become a Patron" />

        <Content>
          <MaxWidth width={1024}>
            <Title>Become a CodeSandbox Patron!</Title>

            <SubTitle>
              You can support us by paying a monthly amount of your choice.
              <br />
              The money goes to all expenses of CodeSandbox.
            </SubTitle>

            <Centered horizontal>
              <PricingModal />
            </Centered>
          </MaxWidth>
        </Content>
      </Margin>
    </MaxWidth>
  );
};

export default inject('signals')(Patron);
