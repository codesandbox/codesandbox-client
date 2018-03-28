import * as React from 'react';
import { connect } from 'app/fluent';

import Navigation from 'app/pages/common/Navigation';

import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Title from 'app/components/Title';
import NewSandbox from 'app/components/NewSandbox';

export default connect()
  .with(({ signals }) => ({
    sandboxPageMounted: signals.sandboxPageMounted
  }))
  .toClass(props =>
    class NewSandboxComponent extends React.PureComponent<typeof props> {
      componentDidMount() {
        this.props.sandboxPageMounted();
      }

      render() {
        return (
          <MaxWidth>
            <Margin style={{ height: '100%' }} vertical={1.5} horizontal={1.5}>
              <Navigation title="New Sandbox" />

              <Margin top={9}>
                <Centered horizontal vertical>
                  <Title>New Sandbox</Title>
                  <Margin top={2}>
                    <NewSandbox />
                  </Margin>
                </Centered>
              </Margin>
            </Margin>
          </MaxWidth>
        );
      }
    }
  )
