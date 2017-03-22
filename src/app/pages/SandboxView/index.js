/* @flow */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Sandbox from './Sandbox';
import Create from './Create';
import Centered from '../../components/flex/Centered';

type Props = {
  match: Object,
};

class SandboxView extends React.PureComponent {
  props: Props;

  render() {
    const { match } = this.props;

    return (
      <Centered horizontal vertical>
        <Switch>
          <Route path={`${match.url}/new`} component={Create} />
          <Route path={`${match.url}/:id`} component={Sandbox} />
        </Switch>
      </Centered>
    );
  }
}
export default SandboxView;
