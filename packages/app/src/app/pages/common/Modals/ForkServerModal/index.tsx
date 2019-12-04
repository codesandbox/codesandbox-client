import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { SignInButton } from 'app/pages/common/SignInButton';

import { Container, Heading, Explanation } from '../elements';

export const ForkServerModal: React.FC = () => {
  const {
    state: {
      isLoggedIn,
      editor: { currentSandbox },
    },
    actions: {
      modalClosed,
      editor: { forkSandboxClicked },
    },
  } = useOvermind();

  useEffect(() => {
    // Which means that the user signed in in the meantime with the intention to
    // fork
    if (isLoggedIn) {
      forkSandboxClicked();
      modalClosed();
    }
  }, [forkSandboxClicked, isLoggedIn, modalClosed]);

  const templateDefinition = getTemplateDefinition(currentSandbox.template);
  const niceName = (
    <span style={{ color: templateDefinition.color(), fontWeight: 500 }}>
      {templateDefinition.niceName}
    </span>
  );

  return (
    <Container>
      <Heading>Fork {niceName} Sandbox</Heading>
      <Explanation>
        We execute {niceName} sandboxes in a server container. This is still in
        beta, so we require you to sign in before you can fork a {niceName}{' '}
        sandbox.
      </Explanation>

      <SignInButton style={{ marginTop: 12 }} />
    </Container>
  );
};
