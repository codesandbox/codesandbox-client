import getTemplateDefinition from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';

import { Container, Heading, Explanation } from '../elements';

import { NiceName as NiceNameBase, SignInButton } from './elements';

export const ForkServerModal: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
      modalClosed,
    },
    state: {
      editor: {
        currentSandbox: { template },
      },
      isLoggedIn,
    },
  } = useOvermind();

  useEffect(() => {
    // Which means that the user signed in in the meantime with the intention to fork
    if (isLoggedIn) {
      forkSandboxClicked();

      modalClosed();
    }
  }, [forkSandboxClicked, isLoggedIn, modalClosed]);

  const { color, niceName } = getTemplateDefinition(template);
  const NiceName: FunctionComponent = () => (
    <NiceNameBase color={color()}>{niceName}</NiceNameBase>
  );

  return (
    <Container>
      <Heading>
        Fork <NiceName /> Sandbox
      </Heading>

      <Explanation>
        We execute <NiceName /> sandboxes in a server container. This is still
        in beta, so we require you to sign in before you can fork a <NiceName />{' '}
        sandbox.
      </Explanation>

      <SignInButton />
    </Container>
  );
};
