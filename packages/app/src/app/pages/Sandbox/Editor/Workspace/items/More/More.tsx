import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import track from '@codesandbox/common/lib/utils/analytics';
import SignInButton from 'app/pages/common/SignInButton';
import { useSignals, useStore } from 'app/store';
import { Description } from '../../elements';

const NOT_OWNED_MESSAGE = `Fork this sandbox to make deployments, commit to GitHub, create live sessions with others and more!`;
const NOT_SIGNED_IN_MESSAGE = `Sign in to be able to organize your sandboxes with a dashboard, make deployments, collaborate live with others, make commits to GitHub and more!`;

export const More = observer(() => {
  const {
    editor: { forkSandboxClicked },
  } = useSignals();
  const {
    editor: {
      isForkingSandbox,
      currentSandbox: { owned },
    },
  } = useStore();

  useEffect(() => track('Workspace - More Opened'), []);

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
            onClick={() => forkSandboxClicked()}
          >
            {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
          </ProgressButton>
        ) : (
          <SignInButton block />
        )}
      </Margin>
    </div>
  );
});
