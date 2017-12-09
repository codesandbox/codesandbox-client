// @flow
import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { CurrentUser } from 'common/types';

import { currentUserSelector, jwtSelector } from 'app/store/user/selectors';
import modalActionCreators from 'app/store/modal/actions';
import userActionCreators from 'app/store/user/actions';

import Row from 'common/components/flex/Row';
import HoverMenu from 'app/components/HoverMenu';
import Relative from 'common/components/Relative';
import Tooltip from 'common/components/Tooltip';

import UserMenu from './UserMenu';

const ClickableContainer = styled(Row)`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  border-radius: 2px;
`;

const ProfileInfo = styled.div`
  font-weight: 400;
  text-align: right;
  margin-right: 1em;

  @media (max-width: 1300px) {
    display: none;
  }
`;

const Name = styled.div`
  padding-bottom: 0.2em;
  color: white;
  font-size: 1em;
`;

const Username = styled.div`
  color: ${props => (props.main ? 'white' : 'rgba(255, 255, 255, 0.6)')};
  font-size: ${props => (props.main ? 1 : 0.875)}em;
`;

type Props = {
  user: CurrentUser,
  small?: boolean,
  modalActions: typeof modalActionCreators,
  userActions: typeof userActionCreators,
};

type State = {
  menuOpen: boolean,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
  hasLogin: !!jwtSelector(state),
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
class User extends React.PureComponent<Props, State> {
  static defaultProps = {
    small: false,
  };

  state = {
    menuOpen: false,
  };

  closeMenu = () => this.setState({ menuOpen: false });
  openMenu = () => this.setState({ menuOpen: true });

  openPreferences = () => {
    this.props.modalActions.openPreferences();
  };

  render() {
    const { user, small, userActions } = this.props;
    const { menuOpen } = this.state;

    return (
      <Relative>
        <ClickableContainer onClick={menuOpen ? this.closeMenu : this.openMenu}>
          <ProfileInfo>
            {user.name && <Name>{user.name}</Name>}
            <Username main={!user.name}>{user.username}</Username>
          </ProfileInfo>

          <Tooltip title="User Menu">
            <ProfileImage
              alt={user.username}
              width={small ? 35 : 40}
              height={small ? 35 : 40}
              src={user.avatarUrl}
            />
          </Tooltip>
        </ClickableContainer>
        {menuOpen && (
          <HoverMenu onClose={this.closeMenu}>
            <UserMenu
              openPreferences={this.openPreferences}
              signOut={userActions.signOut}
              username={user.username}
            />
          </HoverMenu>
        )}
      </Relative>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
