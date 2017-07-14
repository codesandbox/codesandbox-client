import React from 'react';
import { connect } from 'react-redux';

import { currentUserSelector } from 'app/store/user/selectors';
import UserWithAvatar from 'app/components/user/UserWithAvatar';

import Title from '../MenuTitle';

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
class UserSettings extends React.PureComponent {
  render() {
    const { user } = this.props;
    return (
      <div>
        <Title>My Account</Title>
        <UserWithAvatar username={user.username} avatarUrl={user.avatarUrl} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(UserSettings);
