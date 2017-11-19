import React from 'react';
import styled from 'styled-components';

import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import Centered from 'common/components/flex/Centered';

import Navigation from 'app/containers/Navigation';

import PricingModal from './PricingModal';

const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

export default function Patron() {
  document.title = 'Patron - CodeSandbox';
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
}
