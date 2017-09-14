import React from 'react';

import Centered from 'app/components/flex/Centered';
import Title from 'app/components/text/Title';

import {
  protocolAndHost,
  signInUrl,
  newSandboxUrl,
} from 'app/utils/url-generator';

type State = {
  code: ?string,
  redirect: ?string,
};

export default class ZeitSignIn extends React.PureComponent<State> {
  constructor(props) {
    super(props);

    // eslint-disable-next-line no-unused-vars
    const [_, code] = document.location.search.match(/\?code=(.*)/);
    console.log('code', code);
    if (code) {
      if (window.opener) {
        this.state = {
          code,
        };
        if (window.opener.location.origin === window.location.origin) {
          window.opener.postMessage(
            {
              type: 'signin',
              data: {
                code,
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
