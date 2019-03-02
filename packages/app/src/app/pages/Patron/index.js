import React from 'react';
import { inject } from 'mobx-react';

import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import MaxWidth from 'common/lib/components/flex/MaxWidth';
import Margin from 'common/lib/components/spacing/Margin';
import Centered from 'common/lib/components/flex/Centered';

import Navigation from 'app/pages/common/Navigation';

import PricingModal from './PricingModal';
import { Content } from './elements';

class Patron extends React.Component {
  componentDidMount() {
    this.props.signals.patron.patronMounted();
  }
  render() {
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
}

export default inject('signals')(Patron);
