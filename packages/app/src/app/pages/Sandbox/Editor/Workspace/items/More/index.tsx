import React from 'react';
import { inject, observer } from 'mobx-react';

import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import SignInButton from 'app/pages/common/SignInButton';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import track from '@codesandbox/common/lib/utils/analytics';

import { Description } from '../../elements';

type Props = {
  store: any;
  signals: any;
};

const NOT_OWNED_MESSAGE = `Fork this sandbox to make deployments, commit to GitHub, create live sessions with others and more!`;
const NOT_SIGNED_IN_MESSAGE = `Sign in to be able to organize your sandboxes with a dashboard, make deployments, collaborate live with others, make commits to GitHub and more!`;

class More extends React.Component<Props> {
  componentDidMount() {
    track('Workspace - More Opened');
  }

  forkSandbox = () => {
    this.props.signals.editor.forkSandboxClicked();
  };

  render() {
    const { owned } = this.props.store.editor.currentSandbox;
    const { isForkingSandbox } = this.props.store.editor;
    const message = !owned ? NOT_OWNED_MESSAGE : NOT_SIGNED_IN_MESSAGE;

    return (
      <div>
        <Description>{message}</Description>
        <Margin margin={1}>
          {!owned ? (
            <ProgressButton
              small
              block
              loading={isForkingSandbox}
              onClick={this.forkSandbox}
            >
              {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
            </ProgressButton>
          ) : (
            <SignInButton block />
          )}
        </Margin>
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(More));
