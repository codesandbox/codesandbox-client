import React from 'react';
import { inject } from 'mobx-react';

import Navigation from 'app/pages/common/Navigation';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import history from 'app/utils/history';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import NewSandboxModal from '../Dashboard/Content/CreateNewSandbox/Modal';

class NewSandboxComponent extends React.PureComponent {
  componentDidMount() {
    this.props.signals.sandboxPageMounted();
  }

  createSandbox = (template, e) => {
    const cmd = e.ctrlKey || e.metaKey;
    const url = sandboxUrl({ id: template.shortid });
    if (cmd === true) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  render() {
    return (
      <MaxWidth>
        <Margin style={{ height: '100%' }} vertical={1.5} horizontal={1.5}>
          <Navigation title="New Sandbox" />

          <Margin top={5}>
            <Centered horizontal vertical>
              <Margin style={{ maxWidth: '100%', width: 900 }} top={2}>
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
