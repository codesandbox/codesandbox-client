// @flow
import React from 'react';
import styled from 'styled-components';
import type { CurrentUser } from 'common/types';

import Row from 'app/components/flex/Row';
import HoverMenu from 'app/components/HoverMenu';
import Relative from 'app/components/Relative';
import Tooltip from 'app/components/Tooltip';

import UserMenu from './UserMenu';

const ClickableContainer = styled(Row)`
  cursor: pointer;
`;

const ProfileImage = styled.img`
  border-radius: 2px;
  margin-left: 1em;
`;

const ProfileInfo = styled.div`
  font-weight: 400;
  text-align: right;
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
  signOut: Function,
};

type State = {
  menuOpen: boolean,
};

export default class User extends React.PureComponent {
  props: Props;
  state: State;

  static defaultProps = {
    small: false,
  };

  state = {
    menuOpen: false,
  };

  closeMenu = () => this.setState({ menuOpen: false });
  openMenu = () => this.setState({ menuOpen: true });

  render() {
    const { user, small, signOut } = this.props;
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
        {menuOpen &&
          <HoverMenu onClose={this.closeMenu}>
            <UserMenu signOut={signOut} username={user.username} />
          </HoverMenu>}
      </Relative>
    );
  }
}
