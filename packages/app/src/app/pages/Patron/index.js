import React from 'react';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { inject, observer } from 'app/componentConnectors';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
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

export default inject('signals')(observer(Patron));
