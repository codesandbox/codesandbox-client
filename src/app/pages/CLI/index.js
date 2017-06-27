// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { CurrentUser } from 'common/types';

import Navigation from 'app/containers/Navigation';

import { currentUserSelector } from '../../store/user/selectors';
import userActionCreators from '../../store/user/actions';

import Prompt from './Prompt';

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

type State = {
  loading: boolean,
  error: ?string,
  token: string,
};

type Props = {
  user: CurrentUser,
  signIn: typeof userActionCreators.signIn,
  getAuthToken: typeof userActionCreators.getAuthToken,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
const mapDispatchToProps = dispatch => ({
  signIn: bindActionCreators(userActionCreators.signIn, dispatch),
  getAuthToken: bindActionCreators(userActionCreators.getAuthToken, dispatch),
});
class CLI extends React.PureComponent {
  props: Props;
  state: State = {
    loading: true,
    token: '',
    error: null,
  };

  componentDidMount() {
    if (this.props.user.jwt) {
      this.authorize();
    }
  }

  authorize = async () => {
    const { getAuthToken } = this.props;
    try {
      const token = await getAuthToken();

      this.setState({ token, loading: false });
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
    const { error, token, loading } = this.state;

    return (
      <Container>
        <Navigation title="CLI Authorization" />
        <Prompt
          error={error}
          token={token}
          loading={loading}
          username={user && user.username}
          signIn={this.signIn}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
