// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GithubLogo from 'react-icons/lib/go/mark-github';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';
import notificationActionCreators from 'app/store/notifications/actions';

import Integration from 'app/components/user/Integration';

type Props = {
  user: CurrentUser,
  userActions: typeof userActionCreators,
  notifActions: typeof notificationActionCreators,
};
type State = {
  loading: boolean,
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
  notifActions: bindActionCreators(notificationActionCreators, dispatch),
});
const mapStateToProps = state => ({
  user: currentUserSelector(state),
});

class GitHubIntegration extends React.PureComponent<Props, State> {
  state = {
    loading: false,
  };

  componentDidMount() {
    if (this.props.user.integrations.github) {
      this.props.userActions.fetchZeitUserDetails();
    }
  }

  signIn = () => {
    this.props.userActions.signIn(true);
  };

  addLoading = (func: Function) => async () => {
    this.setState({
      loading: true,
    });

    try {
      await func();
    } catch (e) {
      this.props.notifActions.addNotification(e.message, 'error');
    }

    this.setState({
      loading: false,
    });
  };

  render() {
    const { user, userActions } = this.props;
    return (
      <Integration
        name="GitHub"
        color="#4078c0"
        description="Commiting & Pull Requests"
        Icon={GithubLogo}
        userInfo={user.integrations.github}
        signOut={this.addLoading(userActions.signOutFromGitHubIntegration)}
        signIn={this.addLoading(this.signIn)}
        loading={this.state.loading}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GitHubIntegration);
