import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { CurrentUser } from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';

import ZeitLogo from 'app/components/ZeitLogo';

import Integration from './Integration';

type Props = {
  user: CurrentUser,
  userActions: typeof userActionCreators,
};
type State = {
  loading: {
    zeit: boolean,
  },
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
const mapStateToProps = state => ({
  user: currentUserSelector(state),
});

class Integrations extends React.PureComponent<Props, State> {
  state = {
    loading: {
      zeit: false,
    },
  };

  componentDidMount() {
    if (this.props.user.integrations.zeit) {
      this.props.userActions.fetchZeitUserDetails();
    }
  }

  addLoading = func => async () => {
    this.setState({
      loading: {
        ...this.state.loading,
        zeit: true,
      },
    });

    try {
      await func();
    } catch (e) {
      this.setState({
        loading: {
          ...this.state.loading,
          zeit: false,
        },
      });
    }

    this.setState({
      loading: {
        ...this.state.loading,
        zeit: false,
      },
    });
  };

  render() {
    const { user, userActions } = this.props;
    return (
      <div>
        <Integration
          name="ZEIT"
          color="black"
          description="Deployments"
          Icon={ZeitLogo}
          userInfo={user.integrations.zeit}
          signOut={this.addLoading(userActions.signOutFromZeit)}
          signIn={this.addLoading(userActions.signInZeit)}
          loading={this.state.loading.zeit}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);
