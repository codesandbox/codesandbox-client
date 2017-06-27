// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SockJS from 'sockjs-client';

import type { CurrentUser } from 'common/types';

import Centered from 'app/components/flex/Centered';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import Button from '../../components/buttons/Button';
import { currentUserSelector } from '../../store/user/selectors';
import userActionCreators from '../../store/user/actions';

const Buttons = styled.div`
  display: flex;

  > button {
    margin: 1rem;
  }
`;

type State = {
  success: boolean,
  loading: boolean,
  error: ?string,
};

type Props = {
  user: CurrentUser,
  signIn: typeof userActionCreators.signIn,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
const mapDispatchToProps = dispatch => ({
  signIn: bindActionCreators(userActionCreators.signIn, dispatch),
});
class CLI extends React.PureComponent {
  props: Props;
  state: State = {
    success: false,
    loading: false,
    error: null,
  };

  constructor(props) {
    super(props);

    const port = this.getPort();
    if (port === null) {
      document.location.href = '/';
      return;
    }

    this.port = port;
  }

  port: number;

  getPort = () => {
    const match = document.location.search.match(/\?port=(.*)/);
    if (match) {
      const portString = match[1];
      return +portString;
    }
    return null;
  };

  $authorizeCLI = (user: CurrentUser) =>
    new Promise((resolve, reject) => {
      try {
        this.setState({ loading: true });
        const sock = new SockJS(`http://localhost:${this.port}/login`);
        let signedIn = false;

        sock.onopen = () => {
          signedIn = true;
          sock.send(JSON.stringify(user));
          resolve();
        };

        sock.onmessage = () => {
          sock.close();
        };

        sock.onclose = () => {
          if (!signedIn) {
            reject(
              new Error(
                'Could not connect with the CLI, please send a message to @Ives13.',
              ),
            );
          }
        };
      } catch (e) {
        reject(e);
      }
    });

  authorize = async () => {
    try {
      await this.$authorizeCLI(this.props.user);

      // Close window after succesfull authorization
      window.close();
      this.setState({ success: true });
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  signIn = async () => {
    try {
      await this.props.signIn();
      await this.authorize();
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  render() {
    const { user } = this.props;
    const { error, loading, success } = this.state;

    if (success) {
      return (
        <Centered horizontal vertical>
          <Title>Succesfully authorized the CLI</Title>
          <SubTitle>You can now close this window</SubTitle>
        </Centered>
      );
    }

    if (error) {
      return (
        <Centered horizontal vertical>
          <Title>An error occured:</Title>
          <SubTitle>{error}</SubTitle>
          <Buttons>
            <Button href="/">Go to homepage</Button>
          </Buttons>
        </Centered>
      );
    }

    if (loading) {
      return (
        <Centered horizontal vertical>
          <Title>Authorizing...</Title>
        </Centered>
      );
    }

    if (!user.jwt) {
      return (
        <Centered horizontal vertical>
          <Title>Welcome to CodeSandbox!</Title>
          <SubTitle>
            To use the CLI you need to sign in with your GitHub account.
          </SubTitle>
          <Buttons>
            <Button onClick={this.signIn}>Sign in with Github</Button>
          </Buttons>
        </Centered>
      );
    }

    return (
      <Centered horizontal vertical>
        <Title>Hello {user.username}!</Title>
        <SubTitle>
          To make use of the CLI you need to authorize it first,<br /> you can
          authorize by pressing {"'"}login{"'"}.
        </SubTitle>
        <Buttons>
          <Button red>Cancel</Button>
          <Button onClick={this.authorize}>Login</Button>
        </Buttons>
      </Centered>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
