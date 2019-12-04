import React from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import {
  protocolAndHost,
  signInUrl,
  newSandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Title } from 'app/components/Title';

// This route is supposed to be opened in a new window, after signing in with
// Github. It should return a postMessage to the parent
// eslint-disable-line-import/no-default-export
export default class SignIn extends React.PureComponent {
  constructor(props) {
    super(props);

    if (props.match.params.jwt) {
      if (window.opener) {
        this.state = {
          jwt: props.match.params.jwt,
        };
        if (window.opener.location.origin === window.location.origin) {
          window.opener.postMessage(
            {
              type: 'signin',
              data: {
                jwt: props.match.params.jwt,
              },
            },
            protocolAndHost()
          );
        }
        return;
      }
      this.state = {
        redirect: '/',
      };
      return;
    }

    this.state = {
      error: 'no message received',
    };
  }

  getMessage = () => {
    if (this.state.redirect) {
      document.location.href = newSandboxUrl();
      return 'Redirecting to sandbox page';
    }
    if (this.state.error) {
      return `Something went wrong while signing in: ${this.state.error}`;
    }
    if (this.state.jwt) return 'Signing in...';
    if (this.state.jwt == null) {
      setTimeout(() => {
        document.location.href = signInUrl();
      }, 2000);
      return 'Redirecting to sign in page...';
    }

    return 'Hey';
  };

  render() {
    return (
      <Centered horizontal vertical>
        <Title>{this.getMessage()}</Title>
      </Centered>
    );
  }
}
