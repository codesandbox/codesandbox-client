import React from 'react';
import styled from 'styled-components';

import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import MaxWidth from 'app/components/flex/MaxWidth';
import Margin from 'app/components/spacing/Margin';
import Centered from 'app/components/flex/Centered';

import Navigation from 'app/containers/Navigation';

import PricingModal from './PricingModal';

const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

export default class Support extends React.PureComponent {
  render() {
    document.title = 'Supporter - CodeSandbox';
    return (
      <MaxWidth>
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="Supporter" />
          <Content>
            <MaxWidth width={1024}>
              <Title>Become a CodeSandbox Supporter!</Title>
              <SubTitle>
                Support CodeSandbox by paying a monthly amount that you can
                choose
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
}
