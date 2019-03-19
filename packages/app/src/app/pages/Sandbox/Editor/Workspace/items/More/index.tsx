import React from 'react';
import { inject, observer } from 'mobx-react';

import { Button } from 'common/lib/components/Button';
import SignInButton from 'app/pages/common/SignInButton';
import Margin from 'common/lib/components/spacing/Margin';
import track from 'common/lib/utils/analytics';

import { Description } from '../../elements';

type Props = {
  store: any;
  signals: any;
};

const NOT_OWNED_MESSAGE = `Fork this sandbox to make deployments, commit to GitHub, create live sessions with others and more!`;
const NOT_SIGNED_IN_MESSAGE = `Sign in to be able to organize your sandboxes with a dashboard, make deployments, collaborate live with others, make commits to GitHub and more!`;

class More extends React.PureComponent<Props> {
  componentDidMount() {
    track('Workspace - More Opened');
  }

  forkSandbox = () => {
    this.props.signals.editor.forkSandboxClicked();
  };

  render() {
    const { owned } = this.props.store.editor.currentSandbox;
    const message = !owned ? NOT_OWNED_MESSAGE : NOT_SIGNED_IN_MESSAGE;

    return (
      <div>
        <Description>{message}</Description>
        <Margin margin={1}>
          {!owned ? (
            <Button small block onClick={this.forkSandbox}>
              Fork Sandbox
            </Button>
          ) : (
            <SignInButton block />
          )}
        </Margin>
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(More));
