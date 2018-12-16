import React from 'react';
import { inject, observer } from 'mobx-react';
import getTemplateDefinition from 'common/templates';
import SignInButton from 'app/pages/common/SignInButton';

import { Container, Heading, Explanation } from '../elements';

class ForkServerModal extends React.Component {
  componentWillUpdate() {
    // Which means that the user signed in in the meantime with the intention to
    // fork
    if (this.props.store.loggedIn) {
      this.props.signals.editor.forkSandboxClicked();
      this.props.signals.modalClosed();
    }
  }

  render() {
    const { store } = this.props;
    const template =
      store.editor.currentSandbox && store.editor.currentSandbox.template;

    const templateDefinition = getTemplateDefinition(template);
    const niceName = (
      <span
        css={`
          color: ${templateDefinition.color()};
          font-weight: 500;
        `}
      >
        {templateDefinition.niceName}
      </span>
    );

    return (
      <Container>
        <Heading>Fork {niceName} Sandbox</Heading>
        <Explanation>
          We execute {niceName} sandboxes in a server container. This is still
          in beta, so we require you to sign in before you can fork a {niceName}{' '}
          sandbox.
        </Explanation>

        <SignInButton
          css={`
            margin-top: 12px;
          `}
        />
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(ForkServerModal));
