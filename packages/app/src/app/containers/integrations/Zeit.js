import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';
import notificationActionCreators from 'app/store/notifications/actions';

import ZeitLogo from 'app/components/ZeitLogo';
import Integration from 'app/components/user/Integration';

type Props = {
  user: CurrentUser,
  userActions: typeof userActionCreators,
  notifActions: typeof notificationActionCreators,
};
type State = {
  loading: {
    zeit: boolean,
  },
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
  notifActions: bindActionCreators(notificationActionCreators, dispatch),
});
const mapStateToProps = state => ({
  user: currentUserSelector(state),
});

class ZeitIntegration extends React.PureComponent<Props, State> {
  state = {
    loading: false,
  };

  componentDidMount() {
    if (this.props.user.integrations.zeit) {
      this.props.userActions.fetchZeitUserDetails();
    }
  }

  addLoading = func => async () => {
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
        name="ZEIT"
        color="black"
        description="Deployments"
        Icon={ZeitLogo}
        userInfo={user.integrations.zeit}
        signOut={this.addLoading(userActions.signOutFromZeit)}
        signIn={this.addLoading(userActions.signInZeit)}
        loading={this.state.loading}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZeitIntegration);
