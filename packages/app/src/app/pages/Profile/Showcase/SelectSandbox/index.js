import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Sandbox from './Sandbox';

import { Padding } from './elements';

class SelectSandbox extends React.Component {
  componentDidMount() {
    // this.props.currentUserActions.loadUserSandboxes();
  }

  setShowcasedSandbox = id => {
    // usersActions.setShowcasedSandboxId(user.username, id);
  };

  render() {
    const { user, showcaseSandboxId } = this.props;

    if (user.sandboxes == null) return <Padding>Loading sandboxes...</Padding>;

    return (
      <div>
        {user.sandboxes
          .filter(x => x)
          .map(sandbox => (
            <Sandbox
              active={sandbox.id === showcaseSandboxId}
              key={sandbox.id}
              sandbox={sandbox}
              setShowcasedSandbox={this.setShowcasedSandbox}
            />
          ))}
      </div>
    );
  }
}

export default inject('signals', 'store')(observer(SelectSandbox));
