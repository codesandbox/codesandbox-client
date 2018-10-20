import React from 'react';
import { inject } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';

import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Title from 'app/components/Title';
import history from 'app/utils/history';
import { sandboxUrl } from 'common/utils/url-generator';

import NewSandboxModal from '../Dashboard/Content/CreateNewSandbox/Modal';

class NewSandboxComponent extends React.PureComponent {
  componentDidMount() {
    this.props.signals.sandboxPageMounted();
  }

  createSandbox = template => {
    history.push(sandboxUrl({ id: template.shortid }));
  };

  render() {
    return (
      <MaxWidth>
        <Margin style={{ height: '100%' }} vertical={1.5} horizontal={1.5}>
          <Navigation title="New Sandbox" />

          <Margin top={9}>
            <Centered horizontal vertical>
              <Title>New Sandbox</Title>
              <Margin style={{ maxWidth: '100%', width: 950 }} top={2}>
                <NewSandboxModal
                  createSandbox={this.createSandbox}
                  width={950}
                />
              </Margin>
            </Centered>
          </Margin>
        </Margin>
      </MaxWidth>
    );
  }
}

export default inject('signals')(NewSandboxComponent);
